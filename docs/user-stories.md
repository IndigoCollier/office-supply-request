# User Stories: Office Supply Request System

> **Status:** Draft  
> **Author:** Indigo Collier  
> **Date:** 04/20/2026

---

## How to Write These

- Format: `As a [user type], I want to [action], so that [goal].`
- Every story needs at least 3 acceptance criteria.
- Acceptance criteria format: `Given [context], When [action], Then [outcome].`
- Include at least one edge case per story (empty input, wrong role, missing field, etc.)

---

## Employee Stories

### OSRS-E1 — Submit a Supply Request
As an employee, I want to submit a supply request with an item, quantity, and reason, so that my manager is aware of what I need and can act on it.

**Acceptance Criteria:**
- Given I am logged in as an employee, When I fill out all required fields and submit the form, Then a new request is created with a status of "Pending" and I see a confirmation.
- Given I am logged in as an employee, When I submit the form with a missing required field, Then the form shows an inline error and does not submit.
- Given I am logged in as an employee, When I enter a quantity of 0 or a negative number, Then the form shows a validation error.

---

### OSRS-E2 — View My Submitted Requests
As an employee, I want to see a list of my submitted requests and their current statuses, so that I know whether my requests have been acted on.

**Acceptance Criteria:**
- Given I am logged in as an employee, When I visit my dashboard, Then I see only my own submitted requests — not other employees' requests.
- Given I am logged in as an employee, When one of my requests has been updated by a manager, Then the new status is visible on my dashboard.
- Given I am logged in as an employee and have no requests yet, When I visit my dashboard, Then I see an empty state message rather than a blank screen.

---

### OSRS-E3 — Restricted Access
As an employee, I want the app to prevent me from accessing the manager dashboard, so that sensitive approval controls are protected.

**Acceptance Criteria:**
- Given I am logged in as an employee, When I attempt to navigate to the manager dashboard URL directly, Then I am redirected and shown an access denied message.
- Given I am not logged in, When I attempt to access any protected route, Then I am redirected to the login page.

---

## Manager Stories

### OSRS-M1 — View All Requests
As a manager, I want to see all submitted supply requests from all employees, so that I have full visibility into what is being requested across the team.

**Acceptance Criteria:**
- Given I am logged in as a manager, When I visit the manager dashboard, Then I see all requests from all employees, not just my own.
- Given I am logged in as a manager, When a new request has been submitted by an employee, Then it appears in my dashboard with a "Pending" status.
- Given I am logged in as a manager and there are no requests, When I visit the dashboard, Then I see an empty state message.

---

### OSRS-M2 — Approve or Deny a Request
As a manager, I want to approve or deny individual requests, so that employees receive a clear decision on their submission.

**Acceptance Criteria:**
- Given I am logged in as a manager, When I approve a request, Then its status changes to "Approved" and the change is saved immediately.
- Given I am logged in as a manager, When I deny a request, Then its status changes to "Denied" and the change is saved immediately.
- Given I am logged in as a manager, When I try to approve a request that is already approved, Then the action is blocked or produces no duplicate state change.

---

### OSRS-M3 — Mark a Request as Fulfilled
As a manager, I want to mark an approved request as fulfilled after the supplies have been ordered, so that the full lifecycle of the request is tracked.

**Acceptance Criteria:**
- Given I am logged in as a manager, When I mark an approved request as fulfilled, Then its status changes to "Fulfilled."
- Given I am logged in as a manager, When I attempt to mark a "Pending" or "Denied" request as fulfilled, Then the action is not available.

---

## Stretch Goal Stories

### OSRS-S1 — Filter Requests by Status
As a manager, I want to filter the request list by status, so that I can focus on what needs my attention.

**Acceptance Criteria:**
- Given I am on the manager dashboard, When I select "Pending" from the filter, Then only pending requests are shown.
- Given I am on the manager dashboard, When I clear the filter, Then all requests are shown again.

---

### OSRS-S2 — Status Timestamps
As a manager, I want to see exactly when each status change occurred, so that I have a clear audit trail.

**Acceptance Criteria:**
- Given a request has been approved, When I view it in the dashboard, Then I can see the date and time it was approved.
- Given a request was submitted and then denied, When I view it, Then I can see both the submission timestamp and the denial timestamp.

---

### OSRS-S3 — Denial Notes
As a manager, I want to attach a reason when denying a request, so that the employee understands why it was not approved.

**Acceptance Criteria:**
- Given I am denying a request, When I submit the denial, Then I am prompted to enter an optional reason.
- Given a request has been denied with a note, When an employee views their request, Then they can see the denial reason.
- Given a request has been denied without a note, When an employee views their request, Then no note field is shown — not a blank or "undefined" value.
