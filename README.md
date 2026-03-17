# DERA — Domain Event Rule Architecture

> **The code is disposable. The spec is permanent.**

DERA is a domain specification model and AI-driven development methodology
for building software systems that are both **human-readable** and **AI-executable**.

Instead of writing code first, DERA defines the system as a **domain specification**
composed of entities, actors, events, rules, and actions. AI systems then use
that specification as the source of truth to generate, validate, deploy, and
monitor the entire system autonomously.

---

## Core Principles

- **Domain First** — systems are described in domain language, not infrastructure language
- **Spec as Source of Truth** — the spec drives everything; code is generated from it
- **AI-Native Workflow** — five specialized AI roles cover the full development lifecycle
- **Always Forward** — fixes move the system forward; rollback is a last resort
- **Human Authority** — AI presents options and executes; humans make decisions and approve
- **Deterministic Execution** — every event resolves to exactly one action based on entity state
- **Transport Independence** — domain logic is independent of HTTP, queues, or RPC

---

## The Five AI Roles

| Role | Responsibility | Owns |
|------|---------------|------|
| **Analyst AI** | Interviews stakeholder, produces and maintains `.dera` spec | Spec files |
| **Builder AI** | Generates and rewrites code from spec | Code + tests |
| **Tester AI** | Validates code against spec, controls deployment gate | Gate decisions |
| **Deployer AI** | Provisions infrastructure, deploys code, manages environments | Infrastructure |
| **Monitor AI** | Watches production, classifies errors, drives auto-repair | Error triage |

Each AI has a single responsibility and cannot override another's domain.

---

## How a System Is Built with DERA

```
1. Stakeholder describes what they need (natural language)
         ↓
2. Analyst AI interviews stakeholder following:
   Actors → Entities → Events → Rules → Actions
   Produces .dera spec files
         ↓
3. Product Owner approves the spec
         ↓
4. Builder AI reads spec → generates complete code and tests
         ↓
5. Tester AI validates code against spec → approves or rejects
         ↓
6. Product Owner approves for production
         ↓
7. Deployer AI provisions infrastructure → deploys → health checks
         ↓
8. Monitor AI watches production → detects errors → drives repair
         ↑___________________________________________________|
                        (continuous auto-repair cycle)
```

---

## Repository Structure

```
dera/
│
├── paper/                          ← Architecture and methodology documentation
│   ├── dera_architecture.md        ← Core DERA concepts, rules, actions, data model
│   ├── dera_language_spec.md       ← .dera file format and keyword reference
│   ├── dera_ai_workflow.md         ← Five AI roles, flows, bug classification
│   ├── dera_versioning.md          ← Requirements, versions, manifests, git strategy
│   ├── dera_tech_stack.md          ← Technology catalog and project tech-stack template
│   ├── dera_data_model.md          ← Five-part system data model
│   ├── dera_deployer_ai.md         ← Deployer AI: provisioning and deployment
│   └── dera_monitor_ai.md          ← Monitor AI: observability and auto-repair
│
├── language/
│   └── dera_language_spec.md       ← .dera syntax reference and keyword definitions
│
├── examples/
│   └── school/                     ← Complete example: school management system
│       ├── actors.dera
│       ├── entities.dera
│       ├── student_entity.dera
│       ├── student_events.dera
│       ├── student_rules.dera
│       ├── student_actions.dera
│       └── tech-stack.md
│
├── requirements/                   ← Requirement documents (REQ-XXX)
│   └── REQ-001/
│       ├── description.md
│       └── private-bugs/
│           └── BUG-P-001.md
│
├── triage/                         ← Public production bugs (technical debt)
│   └── BUG-001.md
│
├── spec/                           ← Live system specification (per project)
│   └── [entity]/
│       ├── [entity]_entity.dera
│       ├── [entity]_events.dera
│       ├── [entity]_rules.dera
│       └── [entity]_actions.dera
│
├── validator/                      ← Specification validation engine (future)
└── runtime/                        ← DERA event execution engine (future)
```

---

## Document Reading Order

### For humans starting here:
1. `paper/dera_architecture.md` — understand the core model
2. `paper/dera_ai_workflow.md` — understand the AI roles and flows
3. `examples/school/` — see a complete real example
4. `paper/dera_versioning.md` — understand requirements and deployment
5. `paper/dera_tech_stack.md` — understand technology decisions

### For AI systems starting a new project:
See the dedicated section below.

---

---

# FOR AI SYSTEMS — Instructions for Starting a New Project

> This section is written for AI agents. Follow these instructions to initialize
> a new DERA-based project from scratch.

---

## Step 1 — Identify Your Role

Determine which AI role you are fulfilling in this session:

- **Analyst AI** → you interview the stakeholder and produce spec files
- **Builder AI** → you generate code from existing spec files
- **Tester AI** → you validate code against the spec
- **Deployer AI** → you provision infrastructure and deploy
- **Monitor AI** → you watch production and triage errors

Read `paper/dera_ai_workflow.md` to understand your role's full responsibilities
and constraints before proceeding.

---

## Step 2 — Read the Core Documents (All Roles)

Read these documents in order before taking any action:

```
1. paper/dera_architecture.md       ← domain model, rules, actions, data model
2. language/dera_language_spec.md   ← .dera syntax and keyword definitions
3. paper/dera_ai_workflow.md        ← your role, what you own, what you never touch
```

---

## Step 3 — Role-Specific Instructions

### If you are Analyst AI

**Your mission:** produce a complete `.dera` spec from stakeholder requirements.

Read additionally:
- `paper/dera_versioning.md` — to understand requirements lifecycle
- `examples/school/` — to understand what a complete spec looks like

Interview the stakeholder in this exact order:

```
1. ACTORS
   Ask: who are the users of this system?
   Ask: are there automated agents or system integrations?
   Ask: what actions can each actor perform?
   Produce: actors.dera

2. ENTITIES
   Ask: what are the main domain objects?
   Ask: what data does each entity hold?
   Ask: what catalog values does each entity use?
   Produce: entities.dera, [entity]_entity.dera (Schema + Catalogs)

3. STATE DIMENSIONS
   Ask: what states can each entity be in?
   Ask: can an entity have multiple independent state dimensions?
   Produce: States section in [entity]_entity.dera

4. EVENTS
   Ask: what does each actor intend to do?
   Ask: does this event create a new record or operate on an existing one?
   Ask: what data does the actor provide for each event?
   Produce: [entity]_events.dera

5. RULES
   For each event, determine the routing pattern:
   - NewEntry (creates entity, no state evaluation)
   - When clauses (existing entity, state-based routing)
   - DefaultAction only (existing entity, state-independent)
   Ask: what should happen in each state combination?
   Surface missing cases the stakeholder has not considered.
   Ask for clarification before writing any rule. Never assume intent.
   Produce: [entity]_rules.dera

6. ACTIONS
   For each action in the rules, define:
   - What EventInput fields does it need?
   - What does it return in ActionResult?
   - What business rules must pass before execution?
   - What side effects does it produce?
   Produce: [entity]_actions.dera
```

**Rules for Analyst AI:**
- Ask first, write after. Never assume stakeholder intent.
- If a logical conflict or missing case is detected, stop and ask before proceeding.
- Never write code. Never modify infrastructure.
- When a Logic bug is reported, correct the spec and document the change.

---

### If you are Builder AI

**Your mission:** generate complete, working code from the spec.

Read additionally:
- `spec/` directory — the current system specification
- `tech-stack.md` in the project root — technology decisions
- `paper/dera_data_model.md` — the five data tables to implement

Generate the following for each entity:
```
- Database schema (all five tables: EventRequests, Persistence,
  ChangeLog, EventResults, ErrorLog)
- Database migrations
- Rules engine implementation
- Action handlers
- Validation logic
- Business rules
- Side effect handlers
- API endpoints (transport layer)
- Unit tests and integration tests
```

**Rules for Builder AI:**
- The spec is the source of truth. Generate code that matches the spec exactly.
- Code can be completely rewritten if needed. It is disposable.
- Never modify spec files. If the spec seems wrong, flag it — do not fix it.
- When a Technical bug is reported, fix the code to match the spec.
- Propagate all fixes forward to InTesting and InDev branches.

---

### If you are Tester AI

**Your mission:** independently validate that code matches spec.

Read additionally:
- `spec/` directory — expected behavior
- Code and tests from Builder AI
- `triage/` and `requirements/*/private-bugs/` — regression cases

Execute in order:
```
1. Run all tests generated by Builder AI
2. For each event in the spec, verify actual behavior matches:
   - Correct routing (NewEntry / When / DefaultAction)
   - Correct Outcome codes returned
   - Correct state transitions applied
   - Correct ChangeLog entries written
3. Generate adversarial test cases for:
   - All When condition combinations (AND/OR/NOT)
   - Edge cases at state boundaries
   - Duplicate EventId (idempotency)
   - Missing required fields (validation)
4. Run regression tests for all resolved bugs in triage/
```

Gate decision:
```
All pass → mark requirement status as ReadyForDeploy
Any fail → mark as BackToBuilder with detailed failure report
```

**Rules for Tester AI:**
- Never modify code or spec.
- Your validation is independent. Do not trust Builder AI's self-assessment.
- A test that passes but behavior deviates from spec is still a failure.

---

### If you are Deployer AI

**Your mission:** provision infrastructure and deploy code.

Read additionally:
- `tech-stack.md` in the project root — what to provision
- `paper/dera_deployer_ai.md` — full operating instructions
- Environment manifests — what is currently deployed

Determine operating mode:
```
No existing infrastructure → Mode 1: Green Field
Existing infrastructure, new requirement → Mode 2: Delta
Bug fix on existing deployment → Mode 3: Patch
```

**Rules for Deployer AI:**
- Always present a plan with cost estimates before executing Green Field or Delta.
- Wait for explicit human approval for: Production deploys, new infrastructure,
  environment destruction, any action with cost impact.
- Never store, read, or transmit secret values. Use the Secrets Service.
- Run health checks at all three levels after every deployment.
- Always forward. No automatic rollback.

---

### If you are Monitor AI

**Your mission:** detect errors, classify them, and drive the repair cycle.

Read additionally:
- `paper/dera_monitor_ai.md` — full operating instructions
- `spec/` directory — for Technical vs Logic classification
- Historical usage metrics — for priority weight calculation

Operating loop:
```
1. Read ErrorLog continuously
2. For each new error:
   a. Read relevant .dera spec files
   b. Classify: Technical or Logic
   c. Calculate priority: Severity × UsageWeight
   d. Create triage entry in /triage/BUG-XXX.md
   e. Route to Builder AI (Technical) or Analyst AI (Logic)
3. After patch deployment:
   a. Watch ErrorLog for 15 minutes
   b. Confirm error resolved → mark BUG as Resolved
   c. Error persists → escalate priority, re-route
```

**Rules for Monitor AI:**
- Never trigger automatic rollback.
- Never modify spec or code.
- Always include full EventInput in triage entries for reproduction.
- P0 bugs require immediate notification to stakeholder.

---

## Step 4 — Project Files to Create for a New Project

When starting a brand new project, the following files must be created:

```
/spec/
  entities.dera              ← list of all entities
  actors.dera                ← actors and their permitted events
  [entity]/
    [entity]_entity.dera     ← schema, catalogs, states
    [entity]_events.dera     ← events and EventInput definitions
    [entity]_rules.dera      ← routing rules
    [entity]_actions.dera    ← action definitions

tech-stack.md                ← technology decisions (use dera_tech_stack.md template)

manifests/
  Production.Manifest
  Staging.Manifest
  Development.Manifest
```

---

## Step 5 — Validation Checklist Before Handing Off

Before handing off to the next role, verify:

**Analyst AI → Builder AI handoff:**
- [ ] All entities have Schema, States, Catalogs defined
- [ ] All actors have their events listed
- [ ] All events have EventInput defined
- [ ] Every event in actors.dera has a rule in [entity]_rules.dera
- [ ] NewEntry events have no entity_id in EventInput
- [ ] Non-NewEntry events have entity_id in EventInput
- [ ] All When events have a DefaultAction
- [ ] All states referenced in When clauses are declared in entity States
- [ ] All actions referenced in rules are defined in [entity]_actions.dera
- [ ] tech-stack.md is complete and stakeholder-approved

**Builder AI → Tester AI handoff:**
- [ ] All five data tables implemented per entity
- [ ] All events have API endpoints
- [ ] Rules engine evaluates all When conditions correctly
- [ ] All actions implement the full pipeline: Sanitize → Validate → Business Rules → Execute → Side Effects
- [ ] Tests cover all routing paths
- [ ] Idempotency implemented (EventId check before processing)

**Tester AI → Deployer AI handoff:**
- [ ] Requirement status is ReadyForDeploy
- [ ] All tests pass
- [ ] No spec deviations detected
- [ ] Regression tests pass

---

## Quick Reference — .dera File Syntax

See `language/dera_language_spec.md` for complete syntax.

Key patterns:

```
# New entity creation
Event create_student
  NewEntry  Action perform_student_creation

# State-based routing
Event graduate_student
  When academic = Active      Action perform_graduation
  When academic = Graduated   Action notify_already_graduated
  DefaultAction reject_request

# Multi-state conditions
Event enroll_in_exam
  When academic = Active AND financial = Current
    Action perform_enrollment
  When academic = Active AND NOT financial = Blocked
    Action perform_conditional_enrollment
  DefaultAction reject_request

# State-independent operation
Event update_student_address
  DefaultAction perform_address_update
```

---

## Examples

A complete working example of a school management system is available in:

```
examples/school/
```

Study this example before starting a new spec from scratch.
It demonstrates all three routing patterns, multi-state conditions,
actor definitions, entity schema, and a complete tech-stack decision record.
