---
name: wolf
description: Use when the user invokes /wolf, says "wolf this", or asks which workflow or process to use for a bug, a feature, or a new product idea. Optional first argument forces the path - fix, feature, or new.
---

# Wolf

Route a piece of work onto a path sized to it, then walk that path. Process scales with the work: a bug gets four steps, a new product gets the full planning chain. Over-processing small work is as much a failure as under-planning big work.

## 1. Triage

If the first argument is `fix`, `feature`, or `new`, use that path. Otherwise classify from the description:

| Path | Signals |
|------|---------|
| **FIX** | Existing behavior is wrong and the correct behavior is already known. No new UX or product decisions. |
| **FEATURE** | New or changed behavior inside an existing product. Fits one branch. May need small design calls; no new architecture. |
| **NEW** | New product, app, or repo — or a change that adds a system boundary (new service, data-model overhaul, new platform), or the who/why is still fuzzy, or other people need to read the plan. |

State the call in one line with the deciding signal ("FEATURE — adds CSV import to an existing screen, no new data model") and continue unless the user objects. Unsure between two paths: pick the smaller one. Escalating later is cheap; ceremony up front is not.

## 2. Walk the path

Invoke each named skill when its step starts; don't paraphrase it from memory.

### FIX
1. `superpowers:systematic-debugging` — reproduce, find the root cause. Grep every caller of what you'll touch; fix it once where they all route through.
2. `superpowers:test-driven-development` — a failing test that captures the bug, then the fix.
3. `superpowers:verification-before-completion` — run it; for UI, use `run` or `claude-in-chrome` on the real app.
4. Done = failing test now passes, nothing else broke, evidence shown.

### FEATURE
1. `superpowers:brainstorming` — pin down behavior, edge cases, and what's out of scope. UI involved: pull references from the Refero MCP and components from the shadcn MCP here.
2. `superpowers:using-git-worktrees` — isolate the branch.
3. `superpowers:writing-plans` — small, test-first tasks.
4. `superpowers:subagent-driven-development` (or `superpowers:executing-plans`) with `superpowers:test-driven-development` per task. UI polish: `impeccable:impeccable`; motion: `motion-design`.
5. `superpowers:verification-before-completion`, then `code-review` (add `security-review` if it touches auth, input, or data).
6. `superpowers:finishing-a-development-branch`.

### NEW
0. Once per project: run the `bmad` skill's setup so `_bmad/` exists (the BMAD skills need it).
1. **Explore** — `bmad-forge-idea` to pressure-test the idea; `anthropic-skills:deep-research` and the Refero MCP for market and visual references. Stay loose.
2. **Define** — `bmad-product-brief` (optional when solo and the idea is clear), then `bmad-prd`. Run the PRD's validate mode before moving on.
3. **Design** — `bmad-ux` locks DESIGN.md + EXPERIENCE.md. Tokens via `ui-ux-pro-max:design-system`; execution and polish via `impeccable:impeccable`; motion via `motion-design`.
4. **Architect** — `bmad-architecture` (draft, then validate).
5. **Thin slice** — in a worktree, build the thinnest end-to-end path through the riskiest part. Feed what you learn back into the PRD/architecture before going further.
6. **Spec** — `bmad-spec`. From here on the spec is the source of truth; earlier docs may go stale.
7. **Plan** — `superpowers:writing-plans` from the spec. For builds big enough to span many sessions, use Task Master (`task-master parse-prd --input=<spec>`) instead. One planner per project, never both.
8. **Build, verify, ship** — the FEATURE path, steps 2–6, per task or milestone.

## 3. Escalate, never silently

- A FIX whose root cause needs new behavior or a design decision → stop, propose FEATURE.
- A FEATURE that needs new architecture, a data-model change, or several PRs → stop, propose NEW. Lighter option: `bmad-spec` on what you have, then continue as FEATURE from the spec.
- A NEW idea that `bmad-forge-idea` shrinks to one feature → drop to FEATURE.

Ask before switching paths; carry over everything already learned.

## Standing rules

- Evidence before "done": tests run, app exercised, output shown.
- One planner, one spec, one source of truth per piece of work.
- Decisions that outlive the session go in the repo (spec, CLAUDE.md, docs), not in chat.
