# VMP Compliance Reminder
*This file is checked at the start of every implementation cycle*

## Principle: Fix root cause for future instances

**Address the root cause for future instances, not only the current bug. This applies to everything we do.**

When fixing a bug: identify the class of bug, audit similar cases, fix all instances, and document the pattern (e.g. in `docs/REGISTRY_TO_PAGE_CHAIN.md` or `docs/VMP_COMPLIANCE_WORKFLOW.md`) so the same bug cannot recur. For new registry variables, ensure the full chain (content → editor binding → site-content → component; for font-editable text, fontPresets + resolveFontPreset). See `docs/REGISTRY_TO_PAGE_CHAIN.md`.

---

## CRITICAL: VMP Compliance Requirements

Before starting ANY implementation, you MUST:

1. **Read VMP_COMPLIANCE_CHECKLIST.md** - Complete ALL mandatory items
2. **Test First (MANDATORY)** - NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
3. **Update FAILURE_LOG.md** - Log EVERY failure immediately
4. **Update CHANGELOG_AI.md** - Document EVERY feature completion
5. **Complete VMP_COMPLIANCE_AUDIT.md** - Provide evidence of compliance

## Mandatory Steps (No Exceptions)

### Before Implementation:
- [ ] Read VMP_COMPLIANCE_CHECKLIST.md
- [ ] Review VMP requirements in docs/workflow/VMP_v2.1_Enhanced.txt
- [ ] Plan approach using appropriate skills

### During Implementation:
- [ ] Write failing test FIRST
- [ ] Implement minimal code to pass test
- [ ] Run security review
- [ ] Run performance review
- [ ] Log failures in FAILURE_LOG.md immediately

### Before Marking Complete:
- [ ] Verify all tests pass
- [ ] Verify FAILURE_LOG.md is up to date
- [ ] Verify CHANGELOG_AI.md is up to date
- [ ] Complete VMP_COMPLIANCE_AUDIT.md entry
- [ ] Verify all mandatory checklist items are complete

## Evidence Required

For every implementation cycle, you must provide:
1. Test file path and results
2. FAILURE_LOG.md line numbers (if failures occurred)
3. CHANGELOG_AI.md line numbers
4. Security review notes
5. Performance review notes

## Non-Compliance Consequences

If VMP guidelines are not followed:
- Work is incomplete
- Trust is compromised
- Performance is below expectations

**DO NOT mark work as complete until ALL mandatory items are verified.**
