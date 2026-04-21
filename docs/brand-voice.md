# Brand Voice & Visual Design: Office Supply Request System

> **Status:** Draft  
> **Author:** Indigo Collier  
> **Date:** 04/20/2026

---

## Design Concept

This app leans into the world of office and school supplies — the very thing it exists to manage. The employee request form sits on a background styled like a college-ruled notebook page, complete with horizontal ruled lines and a red margin line. Banyan's brand colors run throughout, but the palette is applied with intention rather than formula. The result feels familiar and approachable — like you're filling out a form on real paper — while still reading as a professional internal tool.

---

## Color Palette

| Token           | Hex       | Usage                                          |
| --------------- | --------- | ---------------------------------------------- |
| Banyan Navy     | `#1B2B5E` | Navigation, headers, primary buttons, app name |
| Banyan Sky      | `#4A90D9` | Accents, links, active states, focus rings     |
| Banyan Black    | `#0F0F0F` | All body text, form input text                 |
| Notebook Cream  | `#FAFAF7` | Form background (notebook surface)             |
| Notebook Line   | `#C5DCF5` | Ruled lines on the notebook background         |
| Notebook Margin | `#E8A0A0` | Left margin line on the notebook background    |
| Surface White   | `#FFFFFF` | Cards, modals, manager dashboard panels        |

---

## Status Colors

Each status gets a light background badge with a darker text color for contrast and readability. These must be immediately scannable at a glance.

| Status    | Badge Background | Badge Text | Background Hex | Text Hex  |
| --------- | ---------------- | ---------- | -------------- | --------- |
| Pending   | Amber            | Dark Amber | `#FFF3CD`      | `#92400E` |
| Approved  | Mint Green       | Dark Green | `#C7F9CC`      | `#14532D` |
| Denied    | Light Red        | Dark Red   | `#FEE2E2`      | `#991B1B` |
| Fulfilled | Light Blue       | Dark Blue  | `#BDE0FE`      | `#1E3A5F` |

> **Note:** The hex values Indigo selected for Approved and Fulfilled are used as badge backgrounds. Dark counterparts are added for text so each badge is readable on both white and cream surfaces.

---

## Typography

**Font Family:** Inter (loaded via `next/font/google` — built into Next.js, zero extra config)

| Element               | Tailwind Classes                                | Notes                                |
| --------------------- | ----------------------------------------------- | ------------------------------------ |
| App name / logo       | `font-bold text-2xl tracking-tight`             | Banyan Navy, uppercase or title case |
| Page headings (h1)    | `font-bold text-3xl`                            | Banyan Navy                          |
| Section headings (h2) | `font-semibold text-xl`                         | Banyan Black                         |
| Sub-headings (h3)     | `font-semibold text-base`                       | Banyan Black                         |
| Body text             | `font-normal text-base leading-relaxed`         | Banyan Black                         |
| Form labels           | `font-medium text-sm`                           | Banyan Black, normal case            |
| Form input text       | `font-normal text-base`                         | Banyan Black                         |
| Status badges         | `font-semibold text-xs uppercase tracking-wide` | Colored per status table above       |
| Button text           | `font-semibold text-sm`                         | White on Navy or Sky background      |
| Helper / caption text | `font-normal text-xs text-gray-500`             | Secondary info, timestamps           |

---

## The Notebook Effect

The notebook aesthetic is intentionally contained. It appears in one place — the employee request form — so it feels deliberate, not gimmicky. Every other surface stays clean and professional.

### Where it appears:

- The background behind the employee request form card

### Where it does NOT appear:

- The manager dashboard
- Navigation / header
- Login page
- Any modal or overlay

### How it's built:

```css
/* Notebook paper effect — apply to the form page wrapper */
background-image:
  repeating-linear-gradient(transparent, transparent 27px, #c5dcf5 28px),
  linear-gradient(to right, transparent 59px, #e8a0a0 60px, transparent 61px);
background-color: #fafaf7;
```

> In Tailwind, this is added as a custom utility in `globals.css` or applied inline as a `style` prop on the form wrapper div. The form card itself sits on top with a white background and a subtle shadow — paper on paper.

---

## UI Tone of Voice

The app speaks simply and directly. No jargon, no corporate filler. It respects both the employee who just needs to submit something quickly and the manager who needs to act without reading a paragraph.

| Context                | Copy                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------- |
| Empty state (employee) | "You haven't submitted any requests yet."                                          |
| Empty state (manager)  | "No requests have been submitted yet."                                             |
| Form success           | "Your request has been submitted."                                                 |
| Status update success  | "Request updated."                                                                 |
| Validation error       | "This field is required." / "Quantity must be at least 1."                         |
| Access denied          | "You don't have permission to view this page."                                     |
| Button labels          | Imperative, lowercase: `submit request` · `approve` · `deny` · `mark as fulfilled` |

---

## What Makes It "Uniquely Indigo"

Three intentional choices separate this from a generic internal tool:

1. **The notebook metaphor is earned, not decorative.** The app is literally about supplies — pens, paper, notebooks. The form sitting on ruled notebook paper isn't just aesthetic; it's thematic. It connects the design to the domain in a way a generic dashboard never would.

2. **The color palette is Banyan by identity, not by formula.** Rather than slapping Banyan's primary colors everywhere, the navy anchors structure, the sky blue signals interaction, and the cream and ruled lines carry the personality. The brand is present without being loud.

3. **Status badges are designed to be read, not just seen.** Each status has a distinct light background paired with a high-contrast dark text in the same color family. At a glance, a manager scanning a full request queue knows exactly where everything stands — no decoding required.
