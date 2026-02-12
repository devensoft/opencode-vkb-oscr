# Post-Completion Checklist

Use this comprehensive checklist after archiving an OSCR to ensure nothing is missed.

## Immediate Actions

### Code & Repository
- [ ] All changes committed to base branch
- [ ] Commit message follows format: `"Complete OSCR: sync and archive <change-name>"`
- [ ] Changes pushed to remote
- [ ] Archive verified in `openspec/changes/archive/`
- [ ] Original change directory removed

### Testing
- [ ] Unit tests pass (within ±10 of baseline)
- [ ] E2E tests pass (within 80-95 range)
- [ ] Build successful
- [ ] Build size within limits (<405KB baseline)
- [ ] Linting passes
- [ ] No console errors

### Verification
- [ ] Final verification report reviewed
- [ ] All blocking issues resolved
- [ ] Non-blocking issues documented as follow-ups

## Merge & Release

### If Creating PR
- [ ] PR created with clear description
- [ ] References original OSCR
- [ ] Reviewers assigned
- [ ] All checks passing
- [ ] PR merged and branch deleted

### If Direct Merge
- [ ] Merged to main with `--no-ff`
- [ ] Merge commit references change name
- [ ] Base branch deleted (if no longer needed)

### If Tagging Release
- [ ] Version number determined
- [ ] Tag created: `v<version>-<change-name>`
- [ ] Tag message includes change summary
- [ ] Tag pushed to remote
- [ ] Release notes drafted

## Documentation

### Project Documentation
- [ ] CHANGELOG.md updated
- [ ] Version bumped (if applicable)
- [ ] README updated (if API changes)
- [ ] API documentation updated
- [ ] Architecture diagrams updated (if structural changes)

### OSCR Documentation
- [ ] Completion summary created
- [ ] Archive location documented
- [ ] Follow-up items listed
- [ ] Lessons learned noted (optional)

## Follow-Up Items

### Issue Tracking
- [ ] Related issues closed
- [ ] Follow-up cards created for non-blocking issues
- [ ] Cards linked to original change
- [ ] Cards assigned and prioritized

### Project Board
- [ ] OSCR card moved to "Done"
- [ ] Phase cards archived/closed
- [ ] Board reflects current state

### Communication
- [ ] Team notified of completion
- [ ] Stakeholders informed (if applicable)
- [ ] Demo scheduled (if significant feature)
- [ ] Documentation shared

## Optional Cleanup

### Branches
- [ ] Phase branches deleted (after merge)
- [ ] Base branch deleted (if merged to main)
- [ ] Remote branches cleaned up

### Resources
- [ ] Temporary files removed
- [ ] Test data cleaned up
- [ ] Environment variables reset (if needed)

### Retrospective
- [ ] Retrospective scheduled (for significant changes)
- [ ] Lessons learned documented
- [ ] Process improvements identified

## Metrics & Monitoring

### Performance
- [ ] Performance benchmarks run (if applicable)
- [ ] Metrics recorded
- [ ] Degradation investigated (if any)

### Monitoring
- [ ] Alerts configured (if new service)
- [ ] Dashboards updated
- [ ] Runbooks updated

## Final Review

Before considering complete:

- [ ] All checklist items addressed
- [ ] Completion summary reviewed
- [ ] Handoff completed (if applicable)
- [ ] Ready for next change

## Archive Reference

Record for future reference:

```
Change: <change-name>
Archived: YYYY-MM-DD
Location: openspec/changes/archive/YYYY-MM-DD-<change-name>/
Base Branch: <branch-name>
Merged To: main (or kept as base)
Follow-ups: N cards created
```
