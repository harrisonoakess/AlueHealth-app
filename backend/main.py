from __future__ import annotations

import base64
import logging
import os
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import ValidationError

from models import MealAnalysis

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO tighten in production
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("❌ Missing OPENAI_API_KEY in environment")

client = OpenAI(api_key=OPENAI_API_KEY)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = None
if SUPABASE_URL and SUPABASE_KEY:
    try:  # lazy import so dependency stays optional
        from supabase import create_client

        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as err:  # pragma: no cover - optional integration
        logging.warning("Failed to initialise Supabase client: %s", err)
        supabase = None

STRUCTURED_SCHEMA: dict[str, Any] = {
    "name": "MealAnalysis",
    "strict": True,
    "schema": MealAnalysis.model_json_schema(),
}
structured_schema = STRUCTURED_SCHEMA  # backwards compatibility if code references lowercase name


@app.get("/")
def root():
    return {"message": "✅ Backend is running!"}


@app.get("/test-openai")
def test_openai():
    try:
        resp = client.responses.create(
            model="gpt-4.1-mini",
            input=[{
                "role": "user",
                "content": [{"type": "input_text", "text": "Say hello"}],
            }],
        )
        if hasattr(resp, "model_dump"):
            return {"openai_response": resp.model_dump()}
        return {"openai_response": str(resp)}
    except Exception as exc:
        raise HTTPException(500, f"OpenAI test failed: {exc}") from exc


@app.post("/analyze-meal")
async def analyze_meal(
    image: UploadFile = File(...),
    note: str = Form(default=""),
    account_id: str = Form(default=""),
):
    try:
        data = await image.read()
        if not data:
            raise HTTPException(400, "Uploaded file is empty")

        b64 = base64.b64encode(data).decode("utf-8")
        mime = image.content_type or "image/jpeg"
        data_uri = f"data:{mime};base64,{b64}"

        prompt = (
            "Analyze this meal photo and return EXACTLY one JSON object matching the "
            "MealAnalysis schema. Use grams for macros, provide calories/macros for "
            "each item, and round calories_total to the nearest integer. "
            "When uncertain, add an explanation to assumptions[] and lower confidence. "
            f"User note (if any): {note or 'n/a'}"
        )

        resp = client.responses.create(
            model="gpt-4.1-mini",
            input=[{
                "role": "user",
                "content": [
                    {"type": "input_text", "text": prompt},
                    {"type": "input_image", "image_url": data_uri},
                ],
            }],
            response_format={"type": "json_schema", "json_schema": STRUCTURED_SCHEMA},
        )

        raw_json: str | None = None
        try:
            raw_json = resp.output[0].content[0].text  # type: ignore[index]
        except (AttributeError, IndexError, TypeError):
            pass

        if not raw_json and hasattr(resp, "output_text"):
            raw_json = resp.output_text  # type: ignore[assignment]

        if not raw_json:
            raise RuntimeError("Model did not return JSON content")

        meal = MealAnalysis.model_validate_json(raw_json)
        meal.model_version = getattr(resp, "model", None)
        meal.source_image_id = image.filename

        if supabase:
            record = {
                "account_id": account_id or None,
                "meal_id": meal.meal_id,
                "timestamp_iso": meal.timestamp_iso,
                "calories_total": meal.calories_total,
                "items": [item.model_dump() for item in meal.items],
                "suggestion": meal.suggestion,
                "assumptions": meal.assumptions,
                "model_version": meal.model_version,
                "source_image_id": meal.source_image_id,
            }
            supabase.table("meals").insert(record).execute()

        return meal.model_dump()

    except ValidationError as err:
        raise HTTPException(400, f"Schema validation failed: {err}") from err
    except HTTPException:
        raise
    except Exception as err:
        raise HTTPException(500, f"Analysis failed: {err}") from err
