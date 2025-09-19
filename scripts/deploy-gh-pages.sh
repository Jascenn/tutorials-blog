#!/usr/bin/env bash
set -euo pipefail

# Local deploy to gh-pages using git worktree.
# Usage:
#   bash scripts/deploy-gh-pages.sh [--user-site] [--base /custom] [--no-build]
#
# --user-site  Deploying to <user>.github.io (basePath="").
# --base       Override basePath (e.g. /tutorials-blog). Takes precedence.
# --no-build   Skip build step and reuse existing ./out directory.

USER_SITE=0
CUSTOM_BASE=""
SKIP_BUILD=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --user-site) USER_SITE=1; shift ;;
    --base) CUSTOM_BASE="${2:-}"; shift 2 ;;
    --no-build) SKIP_BUILD=1; shift ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

if ! command -v git >/dev/null 2>&1; then
  echo "git is required" >&2; exit 1
fi

# Derive repo name for basePath default
REPO_NAME=""
if git remote get-url origin >/dev/null 2>&1; then
  REPO_NAME=$(git remote get-url origin | sed -E 's#.*/([^/]+)(\.git)?$#\1#')
fi
if [[ -z "$REPO_NAME" ]]; then
  REPO_NAME=$(basename "$PWD")
fi

BASE_PATH=""
if [[ -n "$CUSTOM_BASE" ]]; then
  BASE_PATH="$CUSTOM_BASE"
else
  if [[ "$USER_SITE" == "1" ]]; then BASE_PATH=""; else BASE_PATH="/$REPO_NAME"; fi
fi

echo "Using basePath: '${BASE_PATH}'"

if [[ "$SKIP_BUILD" != "1" ]]; then
  echo "Building static site…"
  NEXT_BASE_PATH="$BASE_PATH" npm run build
fi

if [[ ! -d out ]]; then
  echo "out/ does not exist. Build first or use --no-build only if out/ is ready." >&2
  exit 1
fi

WORKTREE_DIR=.gh-pages

echo "Preparing worktree at ${WORKTREE_DIR}…"
rm -rf "$WORKTREE_DIR"

if git ls-remote --exit-code --heads origin gh-pages >/dev/null 2>&1; then
  git worktree add -B gh-pages "$WORKTREE_DIR" origin/gh-pages
else
  git worktree add -B gh-pages "$WORKTREE_DIR"
fi

echo "Publishing files…"
rsync -av --delete out/ "$WORKTREE_DIR"/
touch "$WORKTREE_DIR/.nojekyll"

pushd "$WORKTREE_DIR" >/dev/null
git add -A
if git diff --cached --quiet; then
  echo "No changes to publish."
else
  git commit -m "deploy: $(date -u +%F' '%T) [skip ci]"
  git push -u origin gh-pages
  echo "Pushed to gh-pages."
fi
popd >/dev/null

echo "Done. Enable GitHub Pages for branch 'gh-pages' in repository settings if not already."

