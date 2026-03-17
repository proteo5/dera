# REQ-001 — Student Enrollment Process

Status:    InDev
Created:   2024-03-16
Stakeholder: [stakeholder name]
Entities affected: Student, Teacher, School

---

## Description

[Natural language description of what the stakeholder needs.
Written by stakeholder, interpreted and formalized by Analyst AI.]

Example:
"We need students to be able to enroll in classes. A teacher should be able
to assign students to their class. The school should enforce a maximum capacity
per class. Students with a delinquent financial status should not be allowed
to enroll."

---

## Analyst AI Notes

Questions asked to stakeholder before writing spec:

1. What happens if a student tries to enroll and the class is at capacity?
   Answer: [stakeholder response]

2. Can a student enroll in multiple classes simultaneously?
   Answer: [stakeholder response]

3. What financial states prevent enrollment?
   Answer: [stakeholder response]

---

## Spec Changes

Files modified by Analyst AI:

- spec/student/student_entity.dera    (added: financial state dimension)
- spec/student/student_events.dera    (added: enroll_in_class event)
- spec/student/student_rules.dera     (added: enrollment routing rules)
- spec/student/student_actions.dera   (added: perform_enrollment action)
- spec/teacher/teacher_events.dera    (added: assign_student_to_class event)
- spec/school/school_rules.dera       (added: capacity business rule)

---

## Acceptance Criteria

- [ ] Student with Active academic and Current financial state can enroll
- [ ] Student with Delinquent financial state receives payment required notice
- [ ] Teacher can assign student to class
- [ ] System rejects enrollment when class is at maximum capacity
- [ ] Duplicate enrollment returns NoAction with ALREADY_ENROLLED code

---

## Private Bugs

See private-bugs/ folder for bugs found during testing of this requirement.
