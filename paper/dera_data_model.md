# DERA System Data Model

---

# Core Principle

Every system built with DERA is composed of five distinct data concerns.
Each concern has a clear purpose, owner, and retention policy.

```
EventRequests   → what was requested
Persistence     → what the domain state is
ChangeLog       → what changed and when
EventResults    → what the outcome was
ErrorLog        → what went wrong technically
```

These five parts are always present in every DERA system regardless of
technology stack or domain.

---

# 1. EventRequests

Stores the full incoming request including metadata and payload.
Used for idempotency, traceability, and bug reproduction.

## Fields

| Field | Type | Description |
|-------|------|-------------|
| EventId | UUID (PK) | Unique event identifier — guarantees idempotency |
| TraceId | string | Distributed trace identifier |
| CorrelationId | string | Groups related events in the same workflow |
| ActorId | string | Who triggered the event |
| EventType | string | Which event was triggered (e.g. graduate_student) |
| EntityId | UUID (nullable) | Target entity — null for NewEntry events |
| EventInput | JSON | Full payload as received — required for bug reproduction |
| Status | enum | Received \| Processing \| Completed \| Failed |
| ReceivedAt | timestamp | When the request arrived |
| CompletedAt | timestamp | When processing finished |

## Purpose

- Idempotency: if EventId was already processed, return stored EventResult
- Debugging: full EventInput allows exact reproduction of any execution
- Audit: complete record of every operation attempted on the system

## Retention

3 to 12 months. Purge after retention window.

---

# 2. Persistence (Domain Data)

The actual entity state. The permanent source of truth for the domain.

## Fields

Each entity defines its own schema via `[entity]_entity.dera`.
All entities share these common fields:

| Field | Type | Description |
|-------|------|-------------|
| [entity]_id | UUID (PK) | Entity identifier |
| [schema fields] | various | Defined in entity .dera schema |
| [state dimensions] | enum per dimension | One field per declared state dimension |
| CreatedAt | timestamp | When the record was first created |
| UpdatedAt | timestamp | When the record was last modified |
| CreatedByEventId | UUID (FK) | EventId that created this record |
| LastModifiedByEventId | UUID (FK) | EventId of last modification |

## Example — Student entity

| Field | Type |
|-------|------|
| student_id | UUID |
| Name | text |
| LastName | text |
| Grade | enum (Grades catalog) |
| Group | enum (Groups catalog) |
| DateOfBirth | date |
| academic_state | enum (Active \| Graduated \| Suspended \| Expelled) |
| financial_state | enum (Current \| Delinquent \| Blocked) |
| CreatedAt | timestamp |
| UpdatedAt | timestamp |

## Purpose

- Permanent record of entity state
- State dimensions evaluated by Rules engine at runtime
- Source of truth for business rules

## Retention

**Permanent.** Domain data is never purged.

---

# 3. ChangeLog

Immutable audit trail of every change to entity data or state.
One record per field changed per event.

## Fields

| Field | Type | Description |
|-------|------|-------------|
| ChangeId | UUID (PK) | Unique change identifier |
| EventId | UUID (FK → EventRequests) | Event that caused the change |
| EntityType | string | Which entity was changed (e.g. Student) |
| EntityId | UUID | Which record was changed |
| Field | string | Which field changed |
| OldValue | string | Previous value |
| NewValue | string | New value |
| ChangedAt | timestamp | When the change was applied |
| ActorId | string | Who triggered the event that caused the change |

## Purpose

- Full audit trail of every state transition
- Who changed what and when and why (via EventId → EventRequests)
- Compliance and regulatory requirements
- Debugging state-related issues

## Retention

3 to 12 months standard. May be extended to permanent for regulated domains
(healthcare, finance, education records).

---

# 4. EventResults

The structured outcome of every event execution.

## Fields

| Field | Type | Description |
|-------|------|-------------|
| ResultId | UUID (PK) | Unique result identifier |
| EventId | UUID (FK → EventRequests) | Event this result belongs to |
| Outcome | enum | Success \| ValidationFailure \| NoAction \| SystemError |
| Code | string | Domain-specific result code (e.g. STUDENT_GRADUATED) |
| Message | string | Human-readable description |
| Data | JSON | Result payload (ActionResult fields) |
| FailedValidations | JSON array | Field, Code, Message per validation failure |
| Warnings | JSON array | Non-blocking warnings |
| TraceId | string | Propagated from EventRequest |
| ExecutedAt | timestamp | When the result was produced |
| DurationMs | integer | Execution time in milliseconds |

## Purpose

- Idempotency: return stored result if same EventId arrives again
- Client response: the EventResult is what gets returned to the actor
- Performance monitoring: DurationMs feeds into observability metrics
- Debugging: full outcome record per event

## Retention

3 to 12 months. Purge after retention window.

---

# 5. ErrorLog

Technical errors that occurred during system execution.
Separate from ChangeLog — captures system failures, not domain changes.

## Fields

| Field | Type | Description |
|-------|------|-------------|
| ErrorId | UUID (PK) | Unique error identifier |
| EventId | UUID (FK → EventRequests, nullable) | Event during which error occurred |
| ErrorType | string | Exception class or error category |
| ErrorMessage | string | Error description |
| StackTrace | text | Full stack trace for debugging |
| ServiceName | string | Which service or module failed |
| EntityType | string (nullable) | Which entity was being processed |
| EntityId | UUID (nullable) | Which record was being processed |
| Environment | string | Production \| Staging \| etc. |
| OccurredAt | timestamp | When the error occurred |
| Resolved | boolean | Whether a fix has been deployed |
| ResolvedByBug | string (nullable) | Reference to triage BUG-XXX that fixed it |
| ResolvedAt | timestamp (nullable) | When the fix was confirmed deployed |

## Purpose

- Monitor AI primary data source for error detection and classification
- Bug reproduction: ErrorId + EventId + EventInput provides full context
- Trend analysis: frequency and patterns drive Monitor AI priority scoring
- Resolution tracking: links errors to their fix via BUG reference

## Retention

1 to 6 months. Resolved errors can be purged sooner.

---

# Data Flow Between the Five Parts

```
Actor sends Event
       ↓
EventRequests  ← record created (Status: Received)
       ↓
Rules engine evaluates entity state from Persistence
       ↓
Action executes
  ├── Success path:
  │     Persistence  ← entity state/data updated
  │     ChangeLog    ← one record per changed field
  │     EventResults ← Outcome: Success
  │     EventRequests ← Status: Completed
  │
  ├── Validation/NoAction path:
  │     EventResults ← Outcome: ValidationFailure | NoAction
  │     EventRequests ← Status: Completed
  │     (no Persistence or ChangeLog records)
  │
  └── Error path:
        ErrorLog     ← error record created
        EventResults ← Outcome: SystemError
        EventRequests ← Status: Failed
```

---

# Retention Policy Summary

| Part | Retention | Reason |
|------|-----------|--------|
| EventRequests | 3–12 months | Idempotency window + debugging |
| Persistence | Permanent | Domain source of truth |
| ChangeLog | 3–12 months (or permanent) | Audit — extend for regulated domains |
| EventResults | 3–12 months | Idempotency + response cache |
| ErrorLog | 1–6 months | Operational, resolved errors purged sooner |

All non-permanent tables should be continuously purged:

```sql
DELETE FROM EventRequests WHERE ReceivedAt < NOW() - INTERVAL '90 days';
DELETE FROM ChangeLog     WHERE ChangedAt  < NOW() - INTERVAL '90 days';
DELETE FROM EventResults  WHERE ExecutedAt < NOW() - INTERVAL '90 days';
DELETE FROM ErrorLog      WHERE OccurredAt < NOW() - INTERVAL '30 days'
                            AND Resolved = true;
```
