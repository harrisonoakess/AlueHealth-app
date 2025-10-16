#!/usr/bin/env python3
"""Send a sample image to the local analyze-meal endpoint."""

from __future__ import annotations

import argparse
import pathlib
import sys

import httpx

SCRIPT_DIR = pathlib.Path(__file__).resolve().parent
DEFAULT_IMAGE = SCRIPT_DIR.parent / "assets/images/icon.png"


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Upload an image to the analyze-meal endpoint for manual testing.",
        epilog="Run while the FastAPI server is listening locally.",
    )
    parser.add_argument("--url", default="http://127.0.0.1:8000/analyze-meal", help="Endpoint URL")
    parser.add_argument("--image", type=pathlib.Path, default=DEFAULT_IMAGE, help="Path to the image file to upload")
    parser.add_argument("--note", default="CLI test image", help="Optional note field")
    parser.add_argument("--account-id", default="", help="Optional account id")
    args = parser.parse_args()

    if not args.image.exists():
        print(f"❌ Image file not found: {args.image}", file=sys.stderr)
        return 1

    with args.image.open("rb") as fh:
        files = {
            "image": (args.image.name, fh, "image/png"),
        }
        data = {
            "note": args.note,
            "account_id": args.account_id,
        }

        try:
            response = httpx.post(args.url, data=data, files=files, timeout=120)
        except Exception as exc:
            print(f"❌ Request failed: {exc}", file=sys.stderr)
            return 1

    if response.status_code != 200:
        print(f"❌ Server returned {response.status_code}: {response.text}", file=sys.stderr)
        return 1

    print("✅ analyze-meal succeeded")
    print(response.text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
