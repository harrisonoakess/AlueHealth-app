#!/usr/bin/env python3
"""Quick OpenAI connectivity check for the backend stack."""

from __future__ import annotations

import argparse
import json
import sys

from dotenv import load_dotenv
from openai import OpenAI


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Send a simple prompt to OpenAI and print the JSON response.",
    )
    parser.add_argument(
        "--prompt",
        default="Reply with a short hello.",
        help="Prompt text sent to the model (default: %(default)s)",
    )
    parser.add_argument(
        "--model",
        default="gpt-4.1-mini",
        help="Model id to use (default: %(default)s)",
    )
    args = parser.parse_args()

    load_dotenv()

    client = OpenAI()

    try:
        response = client.responses.create(
            model=args.model,
            input=[
                {
                    "role": "user",
                    "content": [{"type": "input_text", "text": args.prompt}],
                }
            ],
        )
    except Exception as exc:  # pragma: no cover - manual diagnostic tool
        print(f"❌ OpenAI request failed: {exc}", file=sys.stderr)
        return 1

    if hasattr(response, "model_dump"):
        payload = response.model_dump()
    else:  # pragma: no cover - fallback for unexpected client shapes
        payload = response.__dict__

    print(json.dumps(payload, indent=2))
    print("✅ OpenAI request succeeded.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
