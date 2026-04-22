# Solution Brief: Office Supply Request System

> **Status:** Draft  
> **Author:** Indigo Collier  
> **Date:** 04/20/2026

---

## 1. The Problem

Employees currently submit office supply requests through informal channels like Slack and email, leaving no centralized record — requests get lost, managers lose track of what needs action, and there is no visibility into what was requested, approved, or fulfilled.

---

## 2. The Users

There are two distinct user types in this system.

### Employee

An employee is any team member who needs to request office supplies. Their goal is to submit a request clearly and quickly, and to have visibility into the current status of anything they've submitted. Employees interact with the system through a request form and a personal dashboard showing their submission history.

### Manager

A manager is a member of leadership responsible for reviewing and acting on supply requests. Their goal is to have a centralized, organized view of all incoming requests so that nothing falls through the cracks. Managers can approve, deny, or mark requests as fulfilled — and are the only user type with access to the full request queue.

---

## 3. Data We Are Tracking

**Submitted by the employee (via the request form):**

- Item name — the specific supply being requested
- Quantity — how many units are needed
- Reason — the employee's justification for the request

**Recorded automatically by the system:**

- Employee identity — linked to their authenticated account (name and email)
- Submission timestamp — the date and time the request was created
- Last updated timestamp — the date and time the status was most recently changed

**Recorded by the manager:**

- Request status — one of: `Pending`, `Approved`, `Denied`, or `Fulfilled`

**Stored for authentication:**

- Employee credentials — email and password used to sign in
- Manager credentials — email and password used to sign in
- User role — determines what views and actions are available after login

---

## 4. Core Operations

### Employee Can:

- Sign in using their credentials
- Submit a new supply request (item, quantity, reason)
- View their own past and current requests, including current status

### Manager Can:

- Sign in using their credentials
- View all submitted requests from all employees (who submitted, what was requested, when)
- Update the status of any request: Approve, Deny, or mark as Fulfilled

### Request Lifecycle:

```
Pending → Approved → Fulfilled
Pending → Denied
```

A request enters the system as `Pending`. A manager moves it to `Approved` or `Denied`. Approved requests can then be marked `Fulfilled` once the supplies have been ordered.

---

## 5. What We Are NOT Building

- **Vendor ordering** — managers mark requests as fulfilled within the app, but do not place actual purchase orders through the system
- **Inventory management** — the system does not track stock levels or automatically reorder supplies
- **Messaging or in-app communication** — employees and managers do not exchange messages through this application
- **Order editing** — once a request is submitted, it cannot be modified by the employee; changes require direct communication with the manager
- **Employee registration** — user accounts are pre-created and managed outside the app; there is no self-signup flow
- **Onboarding or training content** — the application is strictly a request and fulfillment tool
