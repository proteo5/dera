# DERA Language Specification

DERA uses `.dera` files to describe system behavior.

File naming convention:

[entity]_[type].dera

Examples:

student_entity.dera  
student_events.dera  
student_rules.dera  
student_actions.dera

Global files:

actors.dera  
entities.dera

## Core Keywords

Entity
Catalog
Schema
States
Actors
Event
EventInput
Rules
NewEntry
When
Action
ActionResult
BusinessRules
SideEffects
DefaultAction

The language is designed to be both human readable and easily parsed by AI systems.

---

## Rules Routing Patterns

### NewEntry
Signals that the event creates a new entity record.
No entity ID is expected in EventInput. No state evaluation occurs.

### When
Signals state-based routing for an existing entity.
Requires entity ID in EventInput. The engine loads the entity and evaluates its current state.
Must always be accompanied by a DefaultAction as a safety net.

### DefaultAction (alone)
Signals a direct action on an existing entity regardless of state.
Requires entity ID in EventInput. No state evaluation occurs.

---

## Rules Routing Summary

| Pattern           | NewEntry | When clauses | DefaultAction | entity_id in EventInput |
|-------------------|----------|--------------|---------------|--------------------------|
| New entity        | ✓        | —            | —             | Not allowed              |
| State-based       | —        | ✓            | Required      | Required                 |
| State-independent | —        | —            | ✓             | Required                 |