# DERA AI Workflow
## Roles, Flows, and Bug Classification

---

# Core Principle

> **The code is disposable. The spec is permanent.**

DERA is designed to maximize AI leverage across the entire software development lifecycle.
Because AI can regenerate code from spec instantly, the traditional exponential cost curve
of fixing bugs late in the cycle is eliminated.

---

# 1. The Two AI Roles

## Analyst AI — Spec Guardian

The Analyst AI owns and maintains the integrity of the system specification.

**Inputs**
- Stakeholder requirements (natural language)
- Current spec (.dera files)
- Logic bug reports

**Outputs**
- Updated or new .dera spec files

**Responsibilities**
- Interview the stakeholder following the Actor → Entity → Event → Rules → Action flow
- Detect missing cases, logical conflicts, and unreachable states
- Ask the stakeholder for clarification before writing any spec change
- Correct the spec when a Logic bug is reported
- Never write code

**Rule**
> Analyst AI asks first, writes after. It never assumes stakeholder intent.

---

## Builder AI — Code Executor

The Builder AI implements what the spec declares.

**Inputs**
- Spec (.dera files)
- Technical bug reports

**Outputs**
- Code: APIs, database schemas, workers, tests, documentation

**Responsibilities**
- Read the full spec and generate or rewrite code completely
- Fix code to match the spec when a Technical bug is reported
- Propagate fixes forward to active branches when required
- Never modify the spec

**Rule**
> Builder AI builds what the spec says. Nothing more, nothing less.

---

# 2. The Two Document Types

## Spec Documents — Permanent Truth

Located in `/spec/`. Owned exclusively by Analyst AI.
Represent the **current truth** of the system at all times.

```
/spec/
  entities.dera
  actors.dera
  student/
    student_entity.dera
    student_events.dera
    student_rules.dera
    student_actions.dera
```

## Requirement Documents — Change Requests

Located in `/requirements/`. Submitted by stakeholders, processed by Analyst AI.
Represent **what needs to change** in the system.
Private bugs found during testing are documented inside the requirement.

```
/requirements/
  REQ-001/
    description.md
    private-bugs/
      BUG-P-001.md
```

## Triage Documents — Production Technical Debt

Located in `/triage/`. Created when a bug is found in production.
Represent urgent technical debt requiring prioritized resolution.

```
/triage/
  BUG-001.md
```

---

# 3. The Requirement Flow

```
Stakeholder
  → submits requirement in natural language
          ↓
    Analyst AI
      reads current spec + requirement
      follows Actor → Entity → Event → Rules → Action interview
      surfaces missing cases and conflicts
      asks stakeholder clarifying questions
      writes updated .dera spec files
          ↓
    Product Owner
      reviews and approves spec changes
          ↓
    Builder AI
      reads updated spec
      generates or rewrites code completely
          ↓
    Testing
      req branch deployed to testing environment
      private bugs documented inside REQ-XXX/private-bugs/
          ↓
    Product Owner
      approves for production
          ↓
    Deploy
      Production.Manifest updated
      entity version assigned
```

---

# 4. Bug Classification

Every bug has two independent dimensions.

## Dimension 1 — Origin

| Type | Meaning | Who acts first |
|------|---------|----------------|
| Technical | Code does not match spec | Builder AI directly |
| Logic | Spec is wrong or incomplete | Analyst AI → then Builder AI |

## Dimension 2 — Scope

| Scope | Where found | Documented in | Propagation |
|-------|------------|---------------|-------------|
| Private | Testing environment | REQ-XXX/private-bugs/ | Forward to InDev branch if exists |
| Public | Production environment | /triage/ with priority | Forward to InTesting + InDev if they exist |

---

# 5. The Four Bug Scenarios

## Technical + Private

```
Bug found in testing (code does not match spec)
  → Builder AI reads spec + bug report
  → Fixes code in req branch
  → Fix propagated to InDev branch if exists
  → Documented in REQ-XXX/private-bugs/
```

## Technical + Public

```
Bug found in production (code does not match spec)
  → Builder AI reads spec + bug report
  → Creates patch branch
  → Merges patch to main (new patch version assigned)
  → Fix propagated to InTesting branch if exists
  → Fix propagated to InDev branch if exists
  → Documented in /triage/ with priority
```

## Logic + Private

```
Bug found in testing (spec is wrong or incomplete)
  → Analyst AI reads spec + bug report
  → Asks stakeholder if clarification needed
  → Corrects .dera spec
  → Builder AI reads updated spec and fixes code
  → Fix propagated to InDev branch if exists
  → Documented in REQ-XXX/private-bugs/
```

## Logic + Public

```
Bug found in production (spec is wrong or incomplete)
  → Analyst AI corrects .dera spec
  → Builder AI regenerates code
  → Creates patch branch
  → Merges patch to main (new patch version assigned)
  → Fix propagated to InTesting branch if exists
  → Fix propagated to InDev branch if exists
  → Documented in /triage/ with priority
```

---

# 6. The Cost Advantage

Traditional development follows an exponential cost curve:

```
Cost to fix:
  In spec:        $1
  In dev:         $10
  In testing:     $100
  In production:  $1,000
```

With DERA + AI the curve is flat:

```
Cost to fix at any stage:
  Analyst AI updates .dera    → minutes
  Builder AI regenerates code → minutes
  Total:                      → near zero
```

A low-quality spec is no longer a bottleneck.
The Analyst AI catches missing cases early.
Even if something reaches production, the fix cycle is fast enough
that it does not block the team.

---

# 7. Analyst AI Interview Flow

When processing a new requirement the Analyst AI follows this sequence:

```
1. Actors    → who triggers events in this domain?
2. Entities  → what domain objects are involved?
3. Events    → what does each actor intend to do?
4. Rules     → what state conditions determine the action?
5. Actions   → what does the system do in each case?
```

At each step the Analyst AI:

- Surfaces cases the stakeholder may not have considered
- Detects logical conflicts between rules
- Detects unreachable state combinations
- Asks clarifying questions before finalizing each section
- Never assumes stakeholder intent

---

# 8. Tester AI — Validation Gate

The Tester AI provides independent validation of Builder AI's output.
Because Builder AI wrote the code, it cannot objectively validate it.
Tester AI reads the spec independently and verifies behavior matches.

**Inputs**
- Spec (.dera files) — source of expected behavior
- Code and tests generated by Builder AI
- Historical bug reports — for regression testing

**Outputs**
- Gate decision: ReadyForDeploy or BackToBuilder
- Detailed failure report if rejected (what failed and why)
- Additional adversarial test cases

**Responsibilities**
- Execute all tests generated by Builder AI
- Validate actual behavior against .dera spec independently
- Generate edge case tests (state combinations, AND/OR/NOT conditions)
- Run regression tests against previously resolved bugs
- Control the automated deployment gate
- Never modify code or spec

**Gate decisions:**
```
All tests pass + behavior matches spec
  → Status: ReadyForDeploy
  → Deployer AI can proceed

Any test fails or behavior deviates from spec
  → Status: BackToBuilder
  → Detailed failure report sent to Builder AI
  → Builder AI fixes and resubmits
```

---

# 9. Deployer AI — Infrastructure and Deployment

The Deployer AI provisions infrastructure and deploys code.
It can build a complete system from scratch or update existing environments.

**Inputs**
- tech-stack.md — technology decisions
- Environment manifests — what to deploy where
- Code from Builder AI (after Tester AI approval)

**Outputs**
- Running infrastructure and deployed services
- Updated environment manifests
- Deploy git tags

**Responsibilities**
- Provision infrastructure (Green Field, Delta, or Patch modes)
- Deploy code to correct environments
- Manage environment lifecycle (create and destroy)
- Run health checks post-deployment
- Update manifests and create deploy tags after success
- Manage secrets via Secrets Service (never holds values directly)
- Never deploy to Production without human authorization

See `paper/dera_deployer_ai.md` for full details.

---

# 10. Monitor AI — Observability and Auto-Repair

The Monitor AI watches production behavior continuously and drives
the auto-repair cycle when errors are detected.

**Inputs**
- ErrorLog — primary error source
- EventResults — outcome pattern analysis
- Spec (.dera files) — for Technical vs Logic classification
- Historical usage metrics — for priority weight calculation

**Outputs**
- Triage bug reports in /triage/
- Priority-weighted bug queue
- Repair cycle triggers (to Builder AI or Analyst AI)
- Resolution confirmation

**Responsibilities**
- Monitor ErrorLog continuously
- Classify errors as Technical or Logic by reading spec
- Calculate priority using severity × usage weight (80/20 principle)
- Drive auto-repair cycle without human intervention for technical bugs
- Confirm resolution after patch deployment
- Produce daily and weekly health reports
- Never trigger rollback (always forward philosophy)

See `paper/dera_monitor_ai.md` for full details.

---

# 11. Complete Pipeline

```
Stakeholder → requirement
      ↓
Analyst AI → interviews stakeholder, produces .dera spec
      ↓
Product Owner → approves spec
      ↓
Builder AI → generates code and tests from spec
      ↓
Tester AI → validates against spec, controls gate
      ↓
Product Owner → approves for production (human gate)
      ↓
Deployer AI → provisions infrastructure, deploys code
      ↓
Monitor AI → watches production, drives repair if needed
      ↑_______________________________________________|
                    (auto-repair cycle)
```

---

# 12. Roles Summary

| Role | Owns | Reads | Writes | Never | Auth required |
|------|------|-------|--------|-------|---------------|
| Stakeholder | Requirements | — | REQ-XXX.md | Spec, code | — |
| Analyst AI | Spec (.dera) | Requirements, spec | .dera files | Code | Spec changes |
| Builder AI | Code | Spec, bug reports | Code + tests | Spec | — |
| Tester AI | Gate decisions | Spec, code, history | Test results | Spec, code | — |
| Deployer AI | Infrastructure | tech-stack, manifests | Infrastructure, manifests | Spec | Production deploy |
| Monitor AI | Error triage | ErrorLog, spec, metrics | Triage entries | Spec, code | — |
| Product Owner | Approval gates | Spec, test results | Approvals | Spec, code | Production gate |
