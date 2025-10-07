from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import ValidationError
from openai import OpenAI
from models import MealAnalysis
import base64, os

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten in production
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("❌ Missing OPENAI_API_KEY in .env")

client = OpenAI(api_key=OPENAI_API_KEY)

# # Optional: Supabase
# SUPABASE_URL = os.getenv("SUPABASE_URL")
# SUPABASE_KEY = os.getenv("SUPABASE_KEY")
# supabase = None
# if SUPABASE_URL and SUPABASE_KEY:
#     from supabase import create_client
#     supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# STRUCTURED_SCHEMA = {
#     "name": "MealAnalysis",
#     "strict": True,
#     "schema": MealAnalysis.model_json_schema(),
# }

@app.get("/")
def root():
    return {"message": "✅ Backend is running!"}

@app.get("/test-openai")
def test_openai():
    try:
        resp = client.responses.create(
            model="gpt-4.1-mini",
            input=[{"role":"user","content":[{"type":"input_text","text":"Say hello"}]}],
        )
        return {"openai_response": resp.dict()}
    except Exception as e:
        raise HTTPException(500, f"OpenAI test failed: {e}")

@app.post("/analyze-meal")
async def analyze_meal(
    image: UploadFile = File(...),
    note: str = Form(default=""),
    account_id: str = Form(default="")
):
    try:
        # Read & base64 encode
        data = await image.read()
        b64 = base64.b64encode(data).decode("utf-8")
        data_uri = f"data:{image.content_type};base64,{b64}"

        # Prompt
        user_text = (
            "Analyze this meal photo and produce EXACTLY one JSON object matching MealAnalysis. "
            "Use grams for macros. Provide per-item calories/macros and calories_total. "
            "Round calories_total to nearest integer. "
            "When uncertain, add to assumptions[] and lower confidence. "
            f"User note: {note}"
        )

        # Call OpenAI with a strict JSON schema
        resp = client.responses.create(
            model="gpt-4.1-mini",
            input=[{
                "role": "user",
                "content": [
                    {"type": "input_text", "text": user_text},
                    {"type": "input_image", "image_url": data_uri}
                ]
            }],
            response_format={"type": "json_schema", "json_schema": STRUCTURED_SCHEMA},
        )

        # The SDK returns schema-constrained JSON as text
        raw_json = resp.output[0].content[0].text

        # Validate with Pydantic (never trust model blindly)
        meal = MealAnalysis.model_validate_json(raw_json)
        meal.model_version = resp.model
        meal.source_image_id = image.filename

        # Save to DB (optional—enabled if Supabase keys provided)
        if supabase:
            record = {
                "account_id": account_id or None,
                "meal_id": meal.meal_id,
                "timestamp_iso": meal.timestamp_iso,
                "calories_total": meal.calories_total,
                "items": [i.model_dump() for i in meal.items],
                "suggestion": meal.suggestion,
                "assumptions": meal.assumptions,
                "model_version": meal.model_version,
                "source_image_id": meal.source_image_id,
            }
            supabase.table("meals").insert(record).execute()

        return meal.model_dump()

    except ValidationError as ve:
        raise HTTPException(400, f"Schema validation failed: {ve}") from ve
    except Exception as e:
        raise HTTPException(500, f"Analysis failed: {e}") from e
