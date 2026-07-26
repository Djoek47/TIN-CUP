# v0 AI - Autonomous Follow-Up System

## How v0 AI Tracks Progress (With or Without User Input)

This system works independently. v0 AI will verify progress by:

---

## Daily Verification (Autonomous)

### 1. Check Git Changes (No User Input Needed)
```bash
# v0 AI will run these commands to detect work:
git log --since="24 hours ago" --oneline
git diff HEAD~5..HEAD --stat
git show --stat [latest commit]
```

**What v0 AI Learns:**
- What code was changed
- How many files modified
- Commit messages describing work
- What features were added/fixed

### 2. Test Key Flows (Automated)
v0 AI will verify:
- ✓ App still runs: `npm run dev`
- ✓ No console errors
- ✓ Core flows work: login, payment, notifications
- ✓ Code compiles: `npm run build` (if available)
- ✓ No new linting issues
- ✓ Database migrations applied

### 3. Analyze Code Changes (Pattern Matching)
V0 AI will inspect:
- New files created → understand feature
- Modified files → detect improvements
- Deleted files → identify cleanup
- Error handling added → quality check
- Tests added → coverage validation

### 4. Performance & Regression Testing
V0 AI checks:
- New dependencies added? (bloat check)
- Breaking changes? (compatibility)
- Type errors? (TypeScript check)
- Unused imports? (cleanup)
- Console.log left behind? (cleanup)

---

## Fallback Options (If Manual Update Missing)

If DAILY_PROGRESS.md not provided, v0 AI will:

1. **Ask for it politely:**
   - "What did you work on today?"
   - "Share DAILY_PROGRESS.md or tell me what changed"

2. **Use git history as truth:**
   - Parse git log automatically
   - Extract work from commit messages
   - Rebuild timeline from diffs

3. **Run automated checks:**
   - Test app immediately
   - Generate regression report
   - Flag any issues

4. **Provide feedback anyway:**
   - "I detected X changes"
   - "These features are working"
   - "I found Y issues"
   - "Next priorities are Z"

---

## Autonomous Commands v0 AI Will Use

When you return each day, v0 AI will automatically:

```bash
# 1. Check for new commits
git log --since="24 hours ago" --pretty=format:"%h - %s"

# 2. Show what files changed
git diff --name-only HEAD~10..HEAD

# 3. View detailed changes
git show [commit hash] --stat

# 4. Check for uncommitted work
git status

# 5. Review recent code
git log -p --since="24 hours ago" -S "function\|const\|class"

# 6. Count lines of code
find app components lib -type f -name "*.tsx" -o -name "*.ts" | xargs wc -l

# 7. Check for errors
grep -r "console.log\|TODO\|FIXME\|BUG" app lib --include="*.tsx" --include="*.ts"

# 8. Verify structure
find app -type f -name "*.tsx" | head -20
```

---

## Verification Report v0 AI Generates

Each followup will include:

```
═════════════════════════════════════════════════════════════════

TIN CUP - DAILY VERIFICATION REPORT
Generated: [Date]

COMMITS DETECTED: X
├─ [commit 1] - Description
├─ [commit 2] - Description
└─ [commit 3] - Description

FILES CHANGED: Y files modified
├─ app/feature.tsx - [+50 lines] [feature add]
├─ lib/util.ts - [+20 lines] [improvement]
└─ components/ui/Button.tsx - [-5 lines] [cleanup]

AUTOMATED TESTS:
✓ App compiles cleanly
✓ Login flow works
✓ No new errors introduced
✓ No console.log leftover
✗ [Any issues found]

METRICS:
- Total lines added: +150
- Total files changed: 4
- Code quality: Excellent
- Performance impact: None

FEATURES COMPLETED:
- [Feature 1] ✓
- [Feature 2] ✓
- [Issue 1] ✓ (fixed)

ISSUES FOUND:
- [Issue] (with fix suggestion)
- [Type error] (location)

NEXT PRIORITIES:
1. [Based on git analysis]
2. [Based on remaining tasks]
3. [Based on complexity]

SUCCESS CRITERIA FOR TOMORROW:
- [ ] Feature X working
- [ ] Feature Y tested
- [ ] No regressions

═════════════════════════════════════════════════════════════════
```

---

## How This Works With User Input

**Best Case (User Updates Provided):**
- DAILY_PROGRESS.md + git history
- v0 AI combines both for complete picture
- Takes 5 minutes
- Maximum context

**Fallback Case (No Manual Update):**
- Git history only
- v0 AI analyzes commits/diffs
- Asks clarifying questions
- Still provides full feedback
- Takes 10 minutes

**Emergency Case (Long Break):**
- v0 AI tracks all commits since last sync
- Recreates work timeline from history
- Tests everything thoroughly
- Generates comprehensive catch-up report
- Takes 20 minutes

---

## What v0 AI Never Forgets

Stored in memory (`cursor-follow-up-workflow.md`):

✓ Project goals
✓ Tech stack
✓ Known issues
✓ Previous priorities
✓ Testing procedures
✓ Key files locations
✓ Success metrics
✓ Team standards

This persists across all conversations.

---

## User Optional - But Helpful

Providing DAILY_PROGRESS.md helps because:
- Explains "why" you changed things (commit messages don't always say)
- Flags challenges encountered
- Lists blockers early
- Sets clear priorities

But v0 AI will work without it.

---

## Key Principle

**Git is the source of truth.**

v0 AI will always verify work by:
1. Reading git history
2. Analyzing actual code changes
3. Testing functionality
4. Detecting regressions

User input is helpful context, not required.

---

## Summary

v0 AI tracks progress:

✓ **Automatically** - git analysis, code inspection
✓ **Independently** - doesn't need manual updates
✓ **Thoroughly** - tests all changes
✓ **Intelligently** - understands patterns
✓ **Persistently** - remembers across conversations
✓ **Helpfully** - still uses manual updates when provided

**Works with or without daily progress reports.**
