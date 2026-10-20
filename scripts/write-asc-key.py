#!/usr/bin/env python3
"""Normalize EXPO_ASC_API_KEY_P8 into a multi-line .p8 at argv[1]."""
import os
import sys
from pathlib import Path

out = Path(sys.argv[1])
raw = os.environ["EXPO_ASC_API_KEY_P8"].strip().strip('"').replace("\\n", "\n")
begin, end = "-----BEGIN PRIVATE KEY-----", "-----END PRIVATE KEY-----"
if "\n" not in raw and raw.startswith(begin) and raw.endswith(end):
    body = raw[len(begin) : -len(end)].replace(" ", "").strip()
    lines = [body[i : i + 64] for i in range(0, len(body), 64)]
    raw = begin + "\n" + "\n".join(lines) + "\n" + end + "\n"
out.write_text(raw if raw.endswith("\n") else raw + "\n")
