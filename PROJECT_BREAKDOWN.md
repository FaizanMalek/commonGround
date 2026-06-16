# CommonGround — Full Project Breakdown

## Overview

**CommonGround** is a real-time donation coordination platform for the Greater Moncton Homelessness Steering Committee (GMHSC) network of 28 homeless-serving organizations. It connects three user types—donors, shelter staff, and network coordinators—in a single web application.

---

## User Types & Entry Points

| User Type | Entry Point | Primary URL |
|-----------|-------------|-------------|
| **Donor** (public) | Homepage, Give page, All Needs | `/`, `/give`, `/donate`, `/all-needs` |
| **Staff** (shelter worker) | Login page | `/login` → `/staff` |
| **Coordinator** (network admin) | Login page | `/login` → `/coordinator` |

---

## Workflow 1: Donor — Making a Donation

### Path A: From Homepage

1. **Land on `/`** — Public needs board
   - Sees all 28 organizations as expandable cards
   - Each card shows org name, top needs with urgency badges (critical/high/medium/low)
   - Can filter by urgency, category; search by keyword
   - Clicks "Donate now" (hero) or "Donate →" on a specific org card

2. **Lands on `/give`** — Donation choice
   - Two cards: "Give Money" (opens modal with contact info) or "Give Resources" (items)
   - If came from org card: banner shows "Donating to: [Org Name]"
   - Clicks "Donate items →"

3. **Lands on `/donate`** — 4-step donation form
   - **Step 1:** Item details — description, category, condition, quantity, unit
   - If arrived with `?org=`, can pick from that org's live needs to pre-fill
   - **Step 2:** Contact info — name, email, phone; optional preferred org
   - **Submit** — System auto-matches donation to best org (or uses preferred)
   - **Confirmation** — Shows matched org, item, reference, org contact, address

4. **Post-submission**
   - Donor receives **email confirmation** with tracking reference
   - Org staff receives notification; donor waits for org to contact them

### Path B: From All Needs

1. **Land on `/all-needs`** — Paginated table of all needs
   - Filter by urgency, category, org type; search
   - Each row has "Donate" button → goes to `/give?org=...`

2. Same flow as Path A from step 2 onward.

### Ease of Use (Donor)

| Aspect | Rating | Notes |
|--------|--------|-------|
| **Finding what to donate** | Easy | Needs board and all-needs list are clear; urgency badges help |
| **Completing the form** | Easy | 4 steps, validation, optional pre-fill from org needs |
| **Understanding next steps** | Easy | Confirmation screen + email spell it out |
| **Language** | Easy | EN/FR toggle on all public pages |
| **Friction points** | Low | No account required; form is straightforward |

---

## Workflow 2: Staff — Managing an Organization

### Login

1. **Go to `/login`**
   - Email + password
   - Staff credentials use the same demo password as coordinator (`password123` by default)
   - Redirected to `/staff`

### Dashboard (Default View)

- **Metrics:** Total donors, open needs, available stock, pending donations
- **Inventory preview** — Top items, "View all" / "+ Add inventory"
- **Needs preview** — Top needs, "+ Post a need"

### Sidebar Navigation

| Section | Purpose |
|---------|---------|
| **Dashboard** | Overview + quick actions |
| **Inventory** | Add/edit/delete items; flag surplus; set expiry; low-stock alerts |
| **Your Needs** | Post, edit, mark received; urgency levels |
| **Other Needs** | Browse other orgs' needs; request surplus fulfillment |
| **Donations** | Incoming matched donations; confirm receipt (adds to inventory) |
| **Analytics** | Charts for org (donors, needs, inventory) |
| **Chats** | Org channel, direct to coordinator, cross-org threads |

### Key Tasks

| Task | Steps | Ease |
|------|-------|------|
| **Add inventory item** | Inventory → + Add item → fill form → Save | Easy |
| **Post a need** | Your Needs → + Post need → item, qty, urgency → Save | Easy |
| **Confirm donation** | Donations → find matched donation → Confirm | Easy |
| **Request surplus** | Other Needs → find surplus → Request | Moderate |
| **Chat with coordinator** | Chats → select thread → send message | Easy |

### Ease of Use (Staff)

| Aspect | Rating | Notes |
|--------|--------|-------|
| **Navigation** | Easy | Sidebar with icons; section names are clear |
| **Inventory management** | Easy | Table with search, filters, sort; inline edit |
| **Donation confirmation** | Easy | One-click confirm; auto-adds to inventory |
| **Real-time updates** | Good | Socket.IO refreshes when new donations/needs arrive |
| **Language** | Easy | EN/FR + dark mode |
| **Friction points** | Low | Some sections (surplus, chat) require a bit of exploration |

---

## Workflow 3: Coordinator — Network-Wide Management

### Login

1. **Go to `/login`**
   - Coordinator credentials (`coordinator@gmhsc.ca` / `Admin123456`)
   - Redirected to `/coordinator`

### Dashboard (Overview)

- **5 KPIs:** Organizations, active needs, critical needs, pending donations, expiring soon
- **Donations pipeline** — Pending vs Confirmed counts
- **Critical shortages** — List of urgent needs
- **Expiring items** — Items expiring in 30 days

### Sidebar Navigation

| Section | Purpose |
|---------|---------|
| **Overview** | Network KPIs, pipeline, critical needs, expiring |
| **Organizations** | List all 28 orgs; create/edit; export CSV |
| **Staff** | Create, activate/deactivate, delete staff across orgs |
| **All Needs** | Network-wide needs; filters; export CSV |
| **Donations** | Full pipeline; advance status; Mark as Resolved |
| **Inventory** | All orgs' inventory; surplus view |
| **Transfers** | Initiate surplus transfers; approve staff requests |
| **Chat** | Message any org or staff |
| **Analytics** | Date-range charts; donations, needs, exports |

### Key Tasks

| Task | Steps | Ease |
|------|-------|------|
| **View network health** | Overview (default) | Easy |
| **Mark donation resolved** | Donations → find row → Mark as Resolved | Easy |
| **Initiate transfer** | Transfers → New transfer → from org, to org, item, qty | Moderate |
| **Approve surplus request** | Transfers (or surplus requests) → Approve/Reject | Easy |
| **Export report** | Any section with Export CSV button | Easy |
| **Add organization** | Organizations → Add Organization | Easy |
| **Add staff** | Staff → Add staff | Easy |

### Ease of Use (Coordinator)

| Aspect | Rating | Notes |
|--------|--------|-------|
| **Navigation** | Easy | Same sidebar pattern as staff; more sections |
| **Pipeline visibility** | Easy | Clear Pending/Confirmed; filters by status |
| **Bulk actions** | Good | CSV exports for needs, inventory, donations, orgs, staff |
| **Transfers** | Moderate | Requires understanding from/to org and item |
| **Friction points** | Low | Dense UI but logical; filters help narrow data |

---

## Cross-User Flows

### Donation Lifecycle (End-to-End)

```
Donor submits (/donate)
    → Donation created (pending)
    → Auto-matched to org (or preferred)
    → Donor gets confirmation email
    → Staff sees in Donations tab
    → Staff confirms receipt
    → Donor gets thank-you email
    → Item auto-added to inventory
    → Coordinator can mark "Resolved" (status: delivered)
```

### Surplus Redistribution

```
Staff A flags item as surplus (Inventory)
    → Coordinator sees in Inventory (surplus filter)
    → Staff B posts need for same item
    → Coordinator initiates transfer OR Staff B requests surplus
    → Coordinator approves request
    → Transfer tracked; Staff B confirms receipt
```

---

## Navigation Summary

### Public (No Login)

| Page | Nav From | Nav To |
|------|----------|--------|
| `/` | — | Needs Board, Give, All Needs, Login |
| `/give` | Home, All Needs, Donate | Donate, Needs Board |
| `/donate` | Give | Confirmation → Needs Board |
| `/all-needs` | Nav bar | Give, Home, Login |
| `/login` | Nav "Staff login" | Staff or Coordinator dashboard |

### Staff Dashboard

- Single-page app; sidebar switches sections
- No page reloads; data fetched via API
- Sign out returns to `/login`

### Coordinator Dashboard

- Same pattern as staff
- More sections (Organizations, Staff, Transfers, Analytics)
- Sign out returns to `/login`

---

## Task Completion Difficulty

| User | Task | Clicks/Steps | Difficulty |
|------|------|--------------|------------|
| Donor | Complete donation | ~8–12 (form + submit) | **Easy** |
| Staff | Confirm donation | 2 (Donations → Confirm) | **Very Easy** |
| Staff | Post a need | 3–4 (Needs → Post → form → Save) | **Easy** |
| Staff | Add inventory | 3–4 (Inventory → Add → form → Save) | **Easy** |
| Coordinator | Mark donation resolved | 2 (Donations → Mark as Resolved) | **Very Easy** |
| Coordinator | Export CSV | 1 (Export button) | **Very Easy** |
| Coordinator | Initiate transfer | 4–5 (Transfers → New → form) | **Moderate** |

---

## UX Strengths

1. **No account for donors** — Reduces friction; anyone can donate quickly
2. **Progressive disclosure** — Donation form in steps; org cards expand on click
3. **Consistent nav** — Same nav bar on public pages; same sidebar pattern for staff/coordinator
4. **Bilingual** — EN/FR on all key pages
5. **Real-time** — Socket.IO updates when donations/needs change
6. **Email feedback** — Donor gets confirmation + thank-you
7. **Plain language** — Minimal jargon; "Donate", "Your Needs", "Mark as Resolved"

---

## UX Considerations

1. **Donor tracking** — No `/track?ref=XXX` page; donor has reference in email only
2. **Staff surplus browse** — Can request surplus but browsing other orgs' surplus is in "Other Needs" / surplus views
3. **Empty states** — New staff with no inventory may see sparse dashboard
4. **Mobile** — Responsive but dashboards are desktop-optimized

---

## Technical Flow (Behind the Scenes)

```
Public pages (/, /give, /donate, /all-needs)
    → Static HTML + fetch to /api/public/*, /api/ai/match-donation
    → No auth

Staff/Coordinator
    → JWT in cookie; /api/auth/me on load
    → fetch to /api/staff/* or /api/coordinator/*
    → Socket.IO for live updates

Donation match
    → POST /api/public/donations (create)
    → POST /api/ai/match-donation (get top 3 orgs)
    → PATCH /api/public/donations/:id/match (apply)
    → sendDonationConfirmation(donation) — email

Staff confirm
    → POST /api/staff/donations/:id/confirm
    → InventoryModel.addQuantityForNeed(...)
    → sendDonationThankYou(donation) — email
```

---

## Summary: Ease of Navigation & Task Completion

| User Type | Overall Ease | Primary Strength | Primary Friction |
|-----------|--------------|------------------|------------------|
| **Donor** | **Easy** | Simple form, no account, clear next steps | None significant |
| **Staff** | **Easy** | Clear sections, one-click confirm | Surplus/Other Needs a bit nested |
| **Coordinator** | **Easy–Moderate** | Full visibility, exports, pipeline | Dense data; transfer flow needs familiarity |

**Bottom line:** A first-time donor can complete a donation in under 2 minutes. A staff member can confirm a donation in under 30 seconds. A coordinator can export a report or mark a donation resolved with minimal clicks. The app is designed for non-technical users with limited time—shelter staff and donors—and succeeds at keeping core tasks simple.
