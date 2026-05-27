# Contest Creation Guide

Complete reference for creating and managing Arena contests on MedAscend.

---

## 1. Overview — Contest Lifecycle

Every contest moves through these statuses in order:

| Status | How it's set | What happens |
|--------|-------------|--------------|
| `draft` | Automatic on create | Contest is invisible to users. Edit freely. |
| `published` | Admin → Update status | Contest is visible to users. Registration opens. |
| `lobby` | Automatic — 10 min before `starts_at` | Waiting room opens. Registration still open. |
| `live` | Automatic — at `starts_at` | Quiz engine active. No new registrations. |
| `ended` | Automatic — at `ends_at` | Quiz over. Unsubmitted sessions auto-finished. |
| `results_published` | Admin → Publish Results button | Ranks, prizes, Elo, badges all finalized. |
| `cancelled` | Admin → Update status | All paid registrations auto-refunded to deposit wallets. |

> **Important:** To go from `ended` → `results_published`, always use the **Publish Results** button — never the status dropdown. The status dropdown will reject that transition. Publish Results runs prize distribution, Elo changes, badges, and trophies all in one shot.

> Editing a contest (title, dates, prize, questions) is only allowed while status is `draft` or `published`. Once `lobby` or beyond, edits are locked.

---

## 2. Step-by-Step: Creating a Contest

### Step 1 — Fill Contest Details

Go to **Admin → Create Contest**. Fill in:

| Field | Notes |
|-------|-------|
| **Title** | 3–200 chars. Keep it clear — e.g. "FMT Full Syllabus — June 2025" |
| **Slug** | Auto-generated if left blank. Used in the URL. |
| **Type** | See type options below |
| **Difficulty** | `easy`, `medium`, `hard`, or `mixed` |
| **Starts at** | Date + time in IST |
| **Duration** | In minutes. `ends_at` is auto-computed as `starts_at + duration` |
| **Entry fee** | In ₹. Set 0 for a free contest |
| **Prize pool** | In ₹. Total amount to be distributed to winners |

**Contest types:**

| Type | Use for |
|------|---------|
| `subject_showdown` | Single subject (e.g. Anatomy, PSM) |
| `all_india_challenge` | Open national contest |
| `topic_blitz` | Specific topic within a subject |
| `flash_quiz` | Short rapid-fire quiz |
| `college_battle` | Restricted to one college |
| `city_championship` | Restricted to one city |
| `year_battle` | Restricted to one year of study |

---

### Step 2 — Prize Distribution

This section appears automatically when entry fee > 0.

You define the payout rank-by-rank (or as ranges for ranks that share the same amount). The **total must equal the prize pool exactly** — the form will block you from proceeding otherwise.

**How to fill it:**

- Each row = a rank range + amount per rank
- Use a single rank (e.g. Rank 1–1) for unique amounts at the top
- Use a range (e.g. Rank 18–25) for ranks that all get the same amount (typically entry-fee refund ranks)

**Example — ₹5,500 pool, ₹99 entry, 25 winners:**

| Rank from | Rank to | ₹ each |
|-----------|---------|--------|
| 1 | 1 | 1150 |
| 2 | 2 | 725 |
| 3 | 3 | 525 |
| 4 | 4 | 380 |
| 5 | 5 | 290 |
| 6 | 6 | 214 |
| 7 | 7 | 185 |
| 8 | 8 | 165 |
| 9 | 9 | 150 |
| 10 | 10 | 140 |
| 11 | 11 | 130 |
| 12 | 12 | 122 |
| 13 | 13 | 116 |
| 14 | 14 | 110 |
| 15 | 15 | 106 |
| 16 | 17 | 100 |
| 18 | 25 | 99 |

Running total shown in teal when it matches the pool, red when it doesn't. You cannot proceed until it matches.

> Ranks 18–25 at ₹99 each = full entry fee back. Standard practice for bottom-tier winners.

---

### Step 3 — Add Questions

Each question requires:
- **Question text**
- **4 options** (A, B, C, D)
- **Correct option** selected
- **Difficulty** — `easy` (+10 pts), `medium` (+12 pts), `hard` (+15 pts)

Negative marks are fixed at **−3** per wrong answer for all questions.

You can add as many questions as needed. The contest draws 20 randomly per user from the full pool at quiz start — so **add more than 20** (recommended: 40) to enable randomisation.

> Questions are shuffled per user. Options are also shuffled per user. No two players see the same question order or option order.

---

### Step 4 — Review & Publish

Step 3 in the wizard shows a full summary:
- Contest details
- Prize distribution per rank
- All questions with correct answers highlighted

Click **Publish Contest** to create it. Status starts as `draft`.

---

## 3. Registration & Timing Rules

| Event | When |
|-------|------|
| Registration opens | Immediately on publish (or `registration_opens_at` if set) |
| Registration closes | 15 minutes before `starts_at` |
| Lobby opens | 10 minutes before `starts_at` (auto) |
| Entry locked | 2 minutes before `starts_at` |
| Quiz starts | Exactly at `starts_at` |
| Quiz ends | `starts_at + duration_minutes` |

---

## 4. Scoring Rules

### Base points
| Difficulty | Correct | Wrong | Skip |
|------------|---------|-------|------|
| Easy | +10 | −3 | 0 |
| Medium | +12 | −3 | 0 |
| Hard | +15 | −3 | 0 |

### Speed bonus
Every second left on the clock when you answer correctly = +1 point.
Max possible: +44 (answer in 1 second, 44 seconds saved).

### Streak bonus (one-time per milestone, cumulative = +48 max)
| Consecutive correct | Bonus |
|--------------------|-------|
| 3 in a row | +3 |
| 5 in a row | +5 |
| 7 in a row | +7 |
| 10 in a row | +9 |
| 15 in a row | +11 |
| 20 in a row | +13 |

A wrong answer or skip resets the streak. Bonuses already earned are kept.

### Ranking tiebreakers (in order)
1. Highest total score
2. Most correct answers
3. Fastest finish time

---

## 5. Anti-Cheat Rules

- Tab/app switch: warning on each switch. **3rd switch = quiz auto-submitted**
- Screenshots and screen recording are disabled. Attempting forfeits entry.
- Once a session starts or is submitted, no re-attempts
- Sharing questions during a live quiz = immediate disqualification
- Entry fees are non-refundable once the contest runs
- If minimum participant count is not met, all entry fees are auto-refunded

---

## 6. After the Quiz Ends

When status reaches `ended`:

1. All unsubmitted sessions are auto-finished by the backend
2. Go to the contest in Admin → the **Publish Results** button appears
3. Click it — this runs in sequence:
   - Computes final ranks (score → correct count → time)
   - Calculates Elo rating changes
   - Distributes prize amounts to winner wallets (`winnings_balance`)
   - Updates user arena stats (best rank, win count, total winnings)
   - Awards badges and trophies
   - Flips status to `results_published`
4. Leaderboard, answer review, and certificate unlock for all participants

> **This cannot be undone.** Double-check registrations are in `paid` status before publishing.

---

## 7. Prize Money Flow

- Prize goes into the winner's **winnings bucket** (separate from their deposit wallet)
- A `wallet_transaction` row is inserted with `type="prize_won"`, `bucket="winnings"`
- TDS is **not** deducted here — only at withdrawal time per §194BA
- Cancelled contests auto-refund to the **deposit wallet** (not winnings)

---

## 8. Editing a Contest

Editable while `draft` or `published`:
- Title, slug, type, difficulty
- Start time, duration
- Entry fee, prize pool
- Prize distribution (rank ranges + amounts)

Not editable once `lobby` or beyond. Use **Cancel** (which triggers refunds) if you need to scrap it.

---

## 9. Deleting a Contest

Only possible while status is `draft`. Once published, you must cancel instead (which auto-refunds all paid registrations).

---

## 10. Common Mistakes to Avoid

| Mistake | What happens |
|---------|-------------|
| Prize distribution total ≠ prize pool | Form blocks you from proceeding |
| Using status dropdown to set `results_published` | API rejects it — use Publish Results button |
| Editing after lobby/live | API rejects changes |
| Adding fewer than 20 questions | Each user gets 20 random questions — need at least 20, ideally 40 |
| Publishing results before all payments are confirmed | Winners with `payment_pending` registrations won't be ranked correctly |
