# wolf-workflow

My Claude Code workflow: how a bug, a feature, or a new product idea becomes shipped software — and an installer that sets up the same toolchain on any machine.

No third-party skills are vendored here. The installer pulls them from their upstream sources so they stay updatable. The only skill this repo owns is `/wolf`, the router.

## Install

Requires Claude Code, Node.js (npm/npx), and git. [uv](https://docs.astral.sh/uv/) is recommended (BMAD's helper scripts use it).

```sh
git clone https://github.com/juanri7/wolf-workflow.git
cd wolf-workflow
node install.mjs            # add --dry-run to print the commands without running them
```

Works on Windows, macOS, and Linux. Safe to re-run; re-running is also how you pick up changes to `/wolf`. To update third-party skills and plugins later: `npx skills update -g` and `claude plugin update <plugin>`.

## Use

```
/wolf <describe the work>        # wolf triages it
/wolf fix <bug>                  # or force a path
/wolf feature <feature>
/wolf new <idea>
```

The paths, steps, and escalation rules live in [`skills/wolf/SKILL.md`](skills/wolf/SKILL.md).

## Principles

1. **Size the process to the work.** Three paths — FIX, FEATURE, NEW. A bug doesn't get a PRD; a new product doesn't skip one. When unsure, start smaller and escalate.
2. **Explore before you define, define before you build.** Loose research and references first; locked documents only once the shape is clear.
3. **One source of truth.** For NEW work the spec is the handoff; once it exists, earlier docs may go stale. One planner per project, never two.
4. **Build a thin slice before committing.** Validate the riskiest path end to end before the spec hardens. Findings flow back into the plan.
5. **Evidence before done.** Tests run, the real app exercised, output shown.
6. **Escalate out loud.** When a fix turns into a feature, or a feature into a product, stop and say so.

## The paths at a glance

| Path | Flow |
|------|------|
| **FIX** | debug to root cause → failing test → fix → verify |
| **FEATURE** | brainstorm → worktree → plan → TDD build → verify + review → finish branch |
| **NEW** | forge idea → brief → PRD → UX → architecture → thin slice → spec → plan → build like FEATURE |

## Toolbox

| Tool | Source | Role in the flow |
|------|--------|------------------|
| BMAD-METHOD (`bmad`, `bmad-forge-idea`, `bmad-product-brief`, `bmad-prd`, `bmad-ux`, `bmad-architecture`, `bmad-spec`, `bmad-advanced-elicitation`) | `bmad-code-org/BMAD-METHOD` via `skills` | NEW-path planning: idea → spec. Run `bmad` setup once per project. |
| Superpowers | `claude-plugins-official` plugin | Execution discipline: brainstorming, plans, TDD, debugging, worktrees, verification, review, branch finishing. |
| Ponytail | `DietrichGebert/ponytail` plugin | Always on. Keeps code minimal; governs what gets built, not planning prose. |
| Impeccable | `pbakaus/impeccable` plugin | UI build quality and finish review. |
| UI/UX Pro Max | `nextlevelbuilder/ui-ux-pro-max-skill` plugin | Design systems and tokens. |
| motion-design | `LottieFiles/motion-design-skill` via `skills` | Animation only. |
| Refero MCP | `api.refero.design/mcp` | Real-product UI references during exploration. |
| shadcn MCP | `shadcn@latest mcp` | Component lookup and install. |
| OpenWiki | `openwiki` (npm) + Claude Code integration | Codebase context: a git-tracked `openwiki/` wiki per repo. Initialize once per repo; `/wolf` reads it before work and updates it after. |
| Task Master MCP | `task-master-ai` (npm) | Optional planner for NEW builds that span many sessions. Replaces `writing-plans` when used. |
| Built-ins | Claude Code | `code-review`, `security-review`, `run`, `claude-in-chrome`. |

### Overlaps, settled

- `superpowers:brainstorming` vs `bmad-forge-idea`: brainstorming for features, forge-idea for products.
- `superpowers:writing-plans` vs Task Master: writing-plans by default; Task Master only for large NEW builds.
- Design skills: UI/UX Pro Max for the system, Impeccable for execution and polish, motion-design for motion.
