# BUG-P-001 — Private Bug (found in testing)

Requirement: REQ-001
Status:      Resolved
Type:        Technical
Found:       2024-03-18
Resolved:    2024-03-18

---

## Spec Reference

File:    spec/student/student_rules.dera
Section: Event enroll_in_class
Rule:    When academic = Active AND financial = Current → Action perform_enrollment

---

## Expected Behavior

A student with academic = Active and financial = Current should be routed
to perform_enrollment and receive Outcome: Success.

---

## Actual Behavior

System was returning reject_request for students with financial = Current.
The financial state was not being loaded before rule evaluation.

---

## Resolution

Builder AI fixed the entity state loader to include all state dimensions
before rule evaluation. Fix propagated to req/REQ-002 (InDev).
