# DERA Versioning and Deployment Model

---

# 1. Two Separate Artifacts

DERA distinguishes two artifacts that are often confused in traditional development.

| Artifact | Identifier | When created | Nature |
|----------|-----------|--------------|--------|
| Requirement | REQ-001 | When stakeholder opens a request | Fluid — can be paused, reprioritized, cancelled |
| Deploy Version | v16.0 | At the moment of production deploy | Immutable — permanent, sequential |

A requirement describes **what needs to change**.
A deploy version describes **what was deployed**.

These are separate concerns tracked independently.

---

# 2. Requirement Lifecycle

```
Open → InDev → InTesting → Closed
                  ↓
            (if urgent arrives)
            Paused → resumes later as next InDev
```

| Status | Meaning |
|--------|---------|
| Open | Submitted by stakeholder, not yet in development |
| InDev | Analyst AI + devs working on spec and code |
| InTesting | Code frozen, testers verifying behavior |
| Closed | Deployed to production successfully |
| Paused | Deprioritized to allow urgent work to proceed |
| Cancelled | Will not be implemented |

**Key constraint:** Only one requirement per entity group can be InDev at a time.
A new requirement can start InDev when the previous one reaches InTesting.

This creates a maximum pipeline of three simultaneous states per entity:

```
v15.0   → Active     (in production)
REQ-045 → InTesting  (frozen, being verified)
REQ-046 → InDev      (started when REQ-045 reached InTesting)
```

---

# 3. Version Assignment

Versions are assigned **only at the moment of production deploy**.

During development and testing, work is referenced by requirement number:

```
Development.Manifest:  Student → REQ-045
Staging.Manifest:      Student → REQ-045
Tester1.Manifest:      Student → REQ-045
```

At deploy, the version number is assigned and the manifest is updated:

```
git tag: deploy-2024.03.16.001

Production.Manifest:
  Student → v16.0    ← version assigned here
  Teacher → v8.0     ← version assigned here
  School  → v4.0     ← version assigned here
```

This means:
- Requirements are fluid during development (can be paused, replaced, reordered)
- Versions are immutable once assigned
- No version gaps occur because numbers are only assigned at deploy

---

# 4. Version Format

```
v16.2
│  └── patch number  (public bug fixes after deploy)
└───── functional version  (assigned at each production deploy)
```

The functional number increments on every deploy regardless of change type.
The patch number increments for each public bug fix applied after deploy.

A deploy that introduces a new requirement creates: `v16.0`
A public bug fix on that deploy creates: `v16.1`, then `v16.2`, etc.

---

# 5. Deploy Tag Format

Every production deployment receives a unique tag:

```
deploy-YYYY.MM.DD.NNN

deploy-2024.03.16.001   first deploy on that date
deploy-2024.03.16.002   second deploy that day (patch or urgent fix)
```

The deploy tag captures the exact state of all specs and code at production deployment.
It is the rollback point for the entire system.

---

# 6. Environment Manifests

Each environment maintains its own manifest declaring what is currently active.

```
Production.Manifest
  deploy:  2024.03.16.001
  Student: v16.0
  Teacher: v8.0
  School:  v4.0

Staging.Manifest
  Student: REQ-047
  Teacher: v8.0
  School:  v4.0

Development.Manifest
  Student: REQ-048
  Teacher: REQ-052
  School:  v4.0

Tester1.Manifest
  Student: REQ-047
  Teacher: v8.0
  School:  v4.0

Tester2.Manifest
  Student: REQ-048
  Teacher: v8.0
  School:  v4.0
```

**Rules:**
- Production always references deploy versions
- All other environments reference requirement branches or versions
- Each tester can have an isolated manifest for independent verification
- Demo environments can freeze specific versions independent of other environments

---

# 7. Multi-Entity Requirements

A single requirement may modify multiple entities simultaneously.

```
REQ-045: Enrollment process
  Entities affected:
    Student → adds financial state, enrollment events and rules
    Teacher → adds class assignment event
    School  → adds capacity business rules
```

At deploy, all affected entity changes are deployed atomically:

```
deploy-2024.03.16.001
  Student → v16.0   (was v15.1)
  Teacher → v8.0    (was v7.4)
  School  → v4.0    (was v3.0)
```

Rollback reverts the entire deploy tag, restoring all entity versions together.
There are no partial deploys of a cross-entity requirement.

---

# 8. Urgent Requirement Handling

When an urgent requirement arrives while another is InTesting:

```
Situation:
  REQ-045  InTesting  (frozen, awaiting approval)
  REQ-047  URGENT     (critical new requirement)

Action:
  REQ-045 → Paused   (no version was assigned, no cost)
  REQ-047 → InDev → InTesting → deploy → v16.0 assigned
  REQ-045 → resumes InDev → InTesting → deploy → v17.0 assigned
```

Because versions are only assigned at deploy, pausing REQ-045 creates no gaps
and no version conflicts. REQ-047 cleanly takes the next available version slot.

---

# 9. Fix Propagation Rules

Fixes always propagate **forward** in the pipeline. Never backward.

```
PRIVATE BUG (found in testing)

  Fix applied to:    InTesting branch (req/REQ-XXX)
  Propagated to:     InDev branch if one exists
  Documented in:     REQ-XXX/private-bugs/


PUBLIC BUG (found in production)

  Fix applied to:    main (creates patch vX.Y+1)
  Propagated to:     InTesting branch if one exists
  Propagated to:     InDev branch if one exists
  Documented in:     /triage/ with priority
```

---

# 10. Git Branch Strategy

```
main
  → always reflects latest production state
  → tagged at every deploy: deploy-YYYY.MM.DD.NNN

req/REQ-045
  → InDev or InTesting
  → multiple devs merge here within the same requirement
  → no new features after reaching InTesting, only private bug fixes

req/REQ-046
  → InDev (started when REQ-045 reached InTesting)

patch/v16.1
  → public bug fix branch
  → merges to main
  → cherry-picked to req/REQ-045 and req/REQ-046 if they exist
```

Branch naming conventions:

```
req/REQ-XXX       requirement branches
patch/vX.Y+1      public bug fix branches
```

---

# 11. Version State Reference

| Version State | Referenced by | Mutable |
|---------------|--------------|---------|
| InDev | req/REQ-XXX branch | Yes |
| InTesting | req/REQ-XXX branch (frozen) | Only private bug fixes |
| Active | Production.Manifest as vX.0 | No |
| Patching | patch/vX.Y branch | Yes until merged |
| Archived | Historical manifest | No |

---

# 12. Development Stages: MVP vs Production

Every system built with DERA passes through two distinct lifecycle stages.
Each stage has different feedback sources, different Monitor AI behavior, and
different definitions of what "done" means.

---

## Stage 1 — MVP (No Production Environment)

In the MVP stage, no production environment exists yet.
The team is building the initial system and validating it with stakeholders.

```
Environments active:
  Development   → InDev branches, active code generation
  Staging       → Integration testing, stakeholder review
  Tester slots  → Independent verification by Tester AI

No Production environment. No deploy versions assigned yet.
```

### Feedback Source in MVP Stage

Feedback comes from **Staging**, not from production errors.

```
Stakeholder reviews behavior on Staging
       ↓
Identifies mismatches → reported as Logic bugs (spec issues)
Identifies failures   → reported as Technical bugs (code issues)
       ↓
Analyst AI or Builder AI resolves
       ↓
Fix verified on Staging
       ↓
Cycle continues until stakeholder approves
```

### Monitor AI in MVP Stage

Monitor AI is **not active** in MVP stage. There is no production ErrorLog to watch.

Feedback is human-driven: stakeholders and testers report issues manually.
All bugs in this stage are **private bugs** — documented inside the relevant REQ-XXX.

### What "Done" Means in MVP Stage

MVP is complete when the stakeholder approves the behavior on Staging
and the Tester AI confirms all spec scenarios pass.

At that point, the first production deploy is authorized:

```
First deploy to Production
       ↓
First deploy tag created:    deploy-YYYY.MM.DD.001
First version assigned:      Student → v1.0  (or whatever the first version is)
       ↓
Production.Manifest created
       ↓
Stage 2 begins
```

---

## Stage 2 — Production

Once Production exists, the system enters continuous delivery mode.

```
Environments active:
  Production    → live system, versioned deploys
  Staging       → integration and regression testing
  Development   → active InDev requirements
  Tester slots  → Tester AI verification
```

### Feedback Source in Production Stage

Feedback comes from **two sources simultaneously**:

```
1. Production ErrorLog   → Monitor AI detects and classifies automatically
2. Stakeholder requests  → New requirements opened as REQ-XXX
```

These are independent tracks. A Monitor AI triage entry does not block
a new requirement from starting InDev.

### Monitor AI in Production Stage

Monitor AI becomes **fully active** once Production exists.

It reads the Production ErrorLog continuously and drives the auto-repair cycle
as defined in `dera_monitor_ai.md`.

```
Production deploy goes live
       ↓
Monitor AI starts watching ErrorLog
       ↓
Errors classified: Technical → Builder AI  |  Logic → Analyst AI
       ↓
Public bug entries created in /triage/
       ↓
Repair cycle runs: fix → test → patch deploy → verify → Resolved
```

### What "Done" Means in Production Stage

There is no final "done" in production. The system is in a continuous cycle:

```
Requirements (new features)     → REQ pipeline → version increments
Public bugs (production errors) → triage pipeline → patch versions
```

The system stabilizes as Monitor AI resolves the backlog and
the ratio of bugs to new features decreases over time.

---

## Stage Comparison

| Concern | MVP Stage | Production Stage |
|---------|-----------|-----------------|
| Production environment | Does not exist | Active, versioned |
| Error feedback source | Stakeholders on Staging | Monitor AI on ErrorLog |
| Bug documentation | Private (inside REQ-XXX) | Public (/triage/) |
| Monitor AI | Inactive | Fully active |
| Version numbers | Not assigned yet | Assigned at each deploy |
| Deploy tags | Not created yet | Created at every deploy |
| Rollback target | Not applicable | Previous deploy tag |
| "Done" definition | Stakeholder approves Staging | Continuous — no final done |
