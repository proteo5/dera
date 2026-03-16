# Domain Event Rule Architecture (DERA)
## A Specification Model for AI-Assisted Software Development

---

# 1. Abstract

This document introduces **Domain Event Rule Architecture (DERA)**, a structured model for designing software systems that are both **human-readable and AI-interpretable**.

DERA organizes software systems around a declarative specification composed of:

- Entities
- Actors
- Events
- Rules
- Actions
- State dimensions

The architecture allows software systems to be described as **domain specifications**, which can be validated, simulated, and later used to generate executable implementations with the assistance of AI systems.

The main goal of DERA is to shift software development from **code-first design** to **domain specification-first design**, enabling AI systems to assist both in requirement analysis and system implementation.

---

# 2. Motivation

Traditional software architectures organize systems around implementation concepts such as:

- controllers
- services
- handlers
- jobs
- background tasks

While these structures are effective for developers, they are often difficult for AI systems and domain experts to understand because the **business logic becomes fragmented across code**.

DERA proposes a different approach.

Instead of describing software as infrastructure components, the system is defined as a **domain specification** composed of:

- entities
- events
- rules
- actions

This allows the specification to act as the **source of truth** for the system.

AI systems can then assist in:

- analyzing requirements
- validating domain logic
- generating implementations
- simulating system behavior

---

# 3. Design Principles

DERA follows several core principles.

### Domain First

The system is described in terms of **domain concepts** rather than infrastructure components.

### Intent Driven

Events represent **what an actor intends to do**, not what the system has already done.

### Deterministic Execution

Every event must resolve deterministically to an action based on entity state.

### Transport Independence

DERA logic is independent from infrastructure such as HTTP, messaging protocols, or RPC.

### AI Friendly Structure

Specifications must be structured in a way that AI systems can analyze and reason about.

### Idempotent Execution

Every event must contain a unique identifier to prevent duplicate execution.

---

# 4. Entities

Entities represent domain objects.

Example:


Entities

 - School
 - Teacher
 - Student


Each entity may define:

- catalogs
- schema
- state dimensions
- events
- rules
- actions

Entities represent the **persistent domain state** of the system.

---

# 5. Catalogs

Catalogs represent enumerated values used by entities.

Example:


 Catalogs  
 - Grades
   - 1 
   - 2
   - 3
   - 4
   - 5
   - 6

- Groups
   - A
   - B
   - C


Catalogs ensure that the system operates on **controlled values**.

---

# 6. Entity Schema

Schema defines the structure of entity data.

Example:


Schema Student

- Name
   - type text
   - required
   - min 5
   - max 50

- LastName
   - type text
   - required
   - min 5
   - max 50

- Grade
   - type catalog Grades
   - required

- Group
   - type catalog Groups
   - required

- DateOfBirth
   - type date
   - required


Schema validation ensures that entities maintain **valid data structures**.

---

# 7. State Dimensions

Entities may contain one or more **state dimensions**.

Example:


States

- Academic
   - Active
   - Graduated
   - Suspended
   - Expelled


At runtime the entity holds a **state vector**.

Example:


academic = ACTIVE


Multiple state dimensions can coexist independently.

---

# 8. Actors

Actors represent the sources of events.

Actors can be:

- human users
- system integrations
- automation agents

Example:


Actors

- Student
   - check_grades
-Teacher
   - set_grades_to_student
   - graduate_student

- Agent
   - send_grades_to_parents_on_first_day_of_month


Actors define **which events they are allowed to trigger**.

---

# 9. Events

Events represent **intentions to perform an operation**.

Example:


Event graduate_student


Each event defines an input structure called **EventInput**.

Example:


Event graduate_student

- EventInput
   - EventId
   - TraceId
   - student_id


---

# 10. Event Identifiers and Idempotency

Every event must contain a unique **EventId**.

The EventId guarantees that the event is processed **only once**.

If the same EventId is received again, the system must return the **previously stored result** without executing the action again.

This provides **idempotent event execution**.

---

# 11. Traceability

Events may include additional identifiers.

### TraceId

TraceId allows tracking execution across services.

### CorrelationId

CorrelationId groups related events belonging to the same workflow.

Example:


EventInput

EventId
TraceId
CorrelationId
student_id


These identifiers enable:

- tracing
- distributed debugging
- workflow correlation

---

# 12. Rules

Rules determine which action to execute based on the type of operation and entity state.

DERA supports three routing patterns.

---

### Pattern 1 — New Entity Creation

Used when the event creates a new entity record.
No entity ID is required in EventInput. No state evaluation occurs.

Example:


Rules

Event create_student
  NewEntry  Action perform_student_creation


---

### Pattern 2 — State-Based Routing

Used when the event operates on an existing entity and the action depends on entity state.
Entity ID is required in EventInput. The Rules engine loads the entity and evaluates its current state.

Example:


Rules

Event graduate_student
  When academic = Active      Action perform_graduation
  When academic = Graduated   Action notify_already_graduated
  When academic = Expelled    Action notify_call_security
  DefaultAction reject_request


`DefaultAction` is required as a safety net for unhandled or unexpected states.

---

### Pattern 3 — Direct Action on Existing Entity

Used when the event operates on an existing entity but the action does not depend on entity state.
Entity ID is required in EventInput.

Example:


Rules

Event update_student_address
  DefaultAction perform_address_update


---

Rules resolve to:


NewEntry              → Action  (creation, no state evaluation)
Event + When clauses  → Action  (state-based routing)
Event + DefaultAction → Action  (state-independent, existing entity)


---

# 13. Actions

Actions implement system behavior.

Example:


Action perform_graduation


Each action defines:

- EventInput
- ActionResult

Example:


Action perform_graduation

EventInput
student_id

ActionResult
academic_state


---

# 14. Action Execution Pipeline

All actions follow a standardized pipeline.


1 Sanitize input
2 Validate EventInput
3 Evaluate Business Rules
4 Execute Domain Logic
5 Side Effects
6 Return ActionResult


---

# 15. Validation vs Business Rules

DERA distinguishes between two types of checks.

### Validation

Validation operates only on **EventInput data**.

Example:

- required fields
- field formats
- type checks

All validation failures are returned together.

---

### Business Rules

Business rules evaluate conditions involving **entity data**.

Example:


Rule no_duplicate_email

Query Users.email = EventInput.email

If found
return NoAction EMAIL_ALREADY_EXISTS


Business rule evaluation stops at the **first failing rule**.

---

# 16. Standard Response Model

Every event returns a structured response.


Outcome
Code
Message
Data
FailedValidations
Warnings
TraceId


---

# 17. Possible Outcomes

### Success


Outcome: Success
Code: STUDENT_CREATED
Message: Student created successfully


### ValidationFailure


Outcome: ValidationFailure
Code: INPUT_VALIDATION_FAILED


Includes an array of:


FailedValidations

Field
Code
Message


### NoAction

Occurs when a business rule prevents execution.


Outcome: NoAction
Code: EMAIL_ALREADY_EXISTS


### SystemError

Used only when the system fails internally.


Outcome: SystemError
Code: DATABASE_FAILURE


---

# 18. Execution Flow

System execution follows this sequence.


Actor
↓
Event
↓
Sanitize
↓
Validation
↓
Business Rules
↓
Action
↓
Side Effects
↓
Response


---

# 19. Data Persistence Model

DERA distinguishes between **domain persistence** and **operational trace data**.

### Domain Data (Permanent)

Entities representing the state of the system.

Example:


Student
Teacher
School


---

### Operational Data (Temporary)

Operational data includes:

- EventRequests
- EventResults
- ChangeLogs
- SystemLogs

These records support:

- idempotency
- debugging
- auditing

---

# 20. Data Retention Policy

Operational data does not need to be stored permanently.

Typical retention policies:

| Data | Retention |
|-----|-----|
EventRequests | 3–12 months |
EventResults | 3–12 months |
ChangeLogs | 3–12 months |
SystemLogs | 1–6 months |

Operational tables should be **continuously purged**.

Example:


DELETE FROM EventResults
WHERE Timestamp < NOW() - INTERVAL '90 days'


Domain data remains permanent.

---

# 21. Specification Validation Engine

Before generating code, the system should validate the specification.

The validation engine detects:

- undefined entities
- unused actions
- events without rules
- rule conflicts
- unreachable states
- circular action dependencies

The validation engine also enforces entity routing constraints:

- Events declared with `NewEntry` must NOT include `[entity]_id` in EventInput
- Events without `NewEntry` MUST include `[entity]_id` in EventInput
- Events with `When` clauses MUST declare a `DefaultAction` as a safety net
- States referenced in `When` clauses must be defined in the entity `States` block

This prevents invalid system designs before implementation.

---

# 22. AI-Assisted Development Workflow

DERA enables AI systems to participate in two stages.

### Specification Stage

AI assists in:

- identifying missing requirements
- detecting logical conflicts
- improving domain modeling

### Implementation Stage

AI generates system components such as:

- APIs
- database schemas
- micro-agents
- tests
- documentation

The **DERA specification becomes the source of truth**.

---

# 23. Benefits

DERA provides several advantages.

- human-readable architecture
- AI-friendly structure
- deterministic domain logic
- validation before implementation
- improved system traceability
- simplified distributed execution

---

# 24. Future Work

Future extensions may include:

- graphical domain editors
- simulation engines
- rule conflict detection tools
- automated test generation
- AI-driven architecture validation