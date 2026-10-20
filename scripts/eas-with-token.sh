#!/usr/bin/env bash
# Use Cloud Agent secrets — never write tokens into git.
set -euo pipefail

if [[ -z "${EXPO_TOKEN:-}" ]]; then
  echo "EXPO_TOKEN is not set in this environment."
  exit 1
fi

ASC_DIR="${TMPDIR:-/tmp}/eas-asc"
mkdir -p "$ASC_DIR"
KEY_PATH="$ASC_DIR/AuthKey.p8"
cleanup() { rm -f "$KEY_PATH" 2>/dev/null || true; }
trap cleanup EXIT

if [[ -n "${EXPO_ASC_API_KEY_P8:-}" && -n "${EXPO_ASC_KEY_ID:-}" && -n "${EXPO_ASC_ISSUER_ID:-}" ]]; then
  python3 "$(dirname "$0")/write-asc-key.py" "$KEY_PATH"
  export EXPO_ASC_API_KEY_PATH="$KEY_PATH"
  export EXPO_NO_CAPABILITY_SYNC="${EXPO_NO_CAPABILITY_SYNC:-1}"
  export EXPO_APPLE_TEAM_ID="${EXPO_APPLE_TEAM_ID:-R98S6HMKZL}"
  echo "ASC API key loaded from secrets (key id set)."
else
  echo "ASC API secrets not fully set — EAS will use remote Expo credentials if already configured."
fi

echo "EXPO_TOKEN detected. Authenticating…"
npx eas-cli whoami

case "${1:-whoami}" in
  whoami) ;;
  build)
    # Build only — submit is a separate step (ASC key env vars, no interactive setup).
    EAS_BUILD_NO_EXPO_GO_WARNING=true EXPO_NO_CAPABILITY_SYNC=1 \
      npx eas-cli build -p ios --profile production --non-interactive
    ;;
  submit)
    EXPO_NO_CAPABILITY_SYNC=1 \
      npx eas-cli submit -p ios --profile production --non-interactive --latest
    ;;
  *)
    echo "Usage: $0 [whoami|build|submit]"
    exit 1
    ;;
esac
