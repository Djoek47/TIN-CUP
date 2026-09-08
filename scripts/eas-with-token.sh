#!/usr/bin/env bash
# Use Cloud Agent / Cursor secret EXPO_TOKEN — never write the token to disk or git.
set -euo pipefail

if [[ -z "${EXPO_TOKEN:-}" ]]; then
  echo "EXPO_TOKEN is not set in this environment."
  echo "Add it in Cursor → Cloud Agent / Environment secrets as EXPO_TOKEN,"
  echo "then start a new agent (or re-inject secrets) and re-run."
  exit 1
fi

echo "EXPO_TOKEN detected (len=${#EXPO_TOKEN}). Authenticating via eas-cli…"
npx eas-cli whoami

case "${1:-whoami}" in
  whoami) ;;
  build)
    npx eas-cli build -p ios --profile production --non-interactive
    ;;
  submit)
    npx eas-cli submit -p ios --profile production --non-interactive --latest
    ;;
  *)
    echo "Usage: $0 [whoami|build|submit]"
    exit 1
    ;;
esac
