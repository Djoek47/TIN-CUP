# Cursor Daily Follow-Up Checklist

## v0 AI Daily Routine

When the user shares progress from Cursor work:

### 1. Review Status (5 min)
- [ ] Read DAILY_PROGRESS.md
- [ ] Check git log for new commits
- [ ] Identify what was completed
- [ ] Note any blockers

### 2. Verify Work (10 min)
- [ ] Run `git diff HEAD~N` to see code changes
- [ ] Check if files compile/no errors
- [ ] Review commit messages for clarity
- [ ] Verify tests pass

### 3. Provide Feedback (5 min)
- [ ] Praise what worked well
- [ ] Flag any issues or improvements
- [ ] Suggest optimizations
- [ ] Validate against original plan

### 4. Next Steps (5 min)
- [ ] Define top 3 priorities for next day
- [ ] Explain rationale
- [ ] Link to relevant files
- [ ] Set success criteria

### 5. Continue Development (As needed)
- [ ] If Cursor didn't finish a feature, complete it
- [ ] If blocker found, resolve and explain
- [ ] Update project status
- [ ] Commit any fixes

---

## Key Commands to Run Daily

```bash
# Check what changed since last review
git log --oneline --since="1 day ago"

# See specific changes
git diff HEAD~1

# Verify no uncommitted work
git status

# Check file structure is intact
find app components lib -type f | wc -l

# Quick health check
npm list | head -20
```

---

## Progress Template for User

Share this format daily:

```markdown
# Daily Update - [DATE]

## Completed
- Feature 1: [description]
- Feature 2: [description]

## Commits
[Paste git log --oneline -N output]

## Blockers
[Any issues encountered]

## Testing
[What was tested and status]

## Next
[What you plan to do next]
```

---

## Current Project Status

**Branch**: tin-cup
**Last Update**: [Last commit date]
**Status**: [Active Development]

### Completed Features (24/24)
All features implemented - see READY_TO_CURSOR.md

### In Progress
- [Track what Cursor is working on]

### Priority List
1. [Next high priority]
2. [Second priority]
3. [Third priority]

---

## Follow-Up Schedule

- **Daily**: Quick 15-min review of changes
- **Weekly**: Deep dive on architecture/design
- **As Needed**: Unblock issues, complete features
