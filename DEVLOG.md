# 🍔 Dev Diary — Food Chain Magnate Online

---

## Entry #1 — Kickoff (February 14–16, 2026)

### Context

Food Chain Magnate is a heavy economic strategy board game (heavy euro) with high combinatorial complexity — branching career trees, demand systems driven by adjacency graphs, and multiple interdependent phases per turn. The goal of this project is to implement a playable digital version in the browser.

---

### Architecture & Scaffold (Day 1)

I went with **vanilla HTML/CSS/JS** with no frameworks, using a classic **MVC** separation:

| Layer | File | Responsibility |
|---|---|---|
| **Model** | `model/GameState.js` | Game state, mutations, validations |
| **View** | `view/GameView.js` | DOM rendering, UI binding |
| **Controller** | `controller/GameController.js` | Model↔view mediation, input handling |
| **Bootstrap** | `app.js` | Layer instantiation and wiring |

**Technical decisions:**
- No build step — direct loading via `<script>` tags for fast iteration
- **Brutalist/Retro** aesthetic (monospace typography, solid borders, reduced palette)
- State exposed via `window.game` for dev debugging — console helper functions (`produceFood()`, `addMoney()`)
- Structure prepared for future migration to ES6 modules + WebSocket multiplayer

**Deliverable:** functional single-player sandbox with player dashboard (balance, inventory, org chart), map grid, and hiring modal.

---

### Formalizing the Rules (Days 2–3)

Produced the `RULES.md` document (~310 lines) as the complete base game specification, serving as the **source of truth** for the engine implementation. Highlights:

- **7 sequential phases per turn** with inter-dependencies (e.g., marketing in phase 6 generates demand tokens consumed in Dinnertime's phase 4 on the following turn)
- **Career tree** with 8 entry-points and branching paths — modeled as a DAG (directed acyclic graph) with ~25 nodes
- **Dinnertime** as the core economic loop: `attractiveness = unitPrice + distance`, resolved via BFS on the road graph
- **Milestone system** (13 permanent bonuses) — first-mover advantage with event-driven detection
- **Bank Reserve** as a two-stage end-game condition (hidden information → reveal → depletion)
- Setup parameterized by player count (2–5 players, grids from 3×3 to 5×4)

---

### 💬 Real talk...

Guys, I've always loved this game precisely because it's absurdly complex. On the physical board, everything flows almost naturally: you and your friends point at the pieces, move tokens, adjust values... and suddenly, the game just works.

Then you sit down to code it and discover the reality: there are countless hidden edge cases. Some are even obvious — like, what if two players tie on attractiveness and the number of waitresses? Or if the bank runs out in the middle of a purchase?

But then come the worst ones: those situations you think no one would be stupid enough to try... but you need to foresee because, well, you never know. Like: what if the guy has a CFO that makes the unit price negative? Or worse: what if he runs out of money during this negative sale process?

I spent two days just refining the rules in `RULES.md` before coding anything. It felt like I wasn't "producing," but it was the best decision — now I have a solid document that works as a spec for the entire engine. Lesson learned: **for complex games, game design document first, code second.**

Excited for the implementation phase. We're craving for Pizza! 🍕

---

**Stack:** `HTML` · `CSS` · `JavaScript` · `MVC`

`#gamedev` `#boardgames` `#javascript` `#indiedev` `#foodchainmagnate` `#devdiary`

---

## Entry #2 — Rules Deep-Dive & Architecture (February 17, 2026)

### The Rules Rabbit Hole

Today I went **deep** into the rules. What started as "fill in a few gaps" turned into a full-day session of rule archaeology — cross-referencing the base rulebook, extraction web searches, and a line-by-line Q&A to nail down every edge case.

The `RULES.md` went from ~310 lines to **~470 lines**. Key additions:

- **18 base game milestones** (was 13) — discovered I was missing First Errand Boy Played, First to Lower Prices, and First Airplane Campaign
- **17 expansion milestones** (The Ketchup Mechanism) — completely detailed with interactions, edge cases, and restriction rules
- **Marketing placement rules** — billboard (orthogonal adjacency), mailbox (by block), avião (tile), radio (tile + adjacent tiles), with resolution order by piece number
- **Demand tokens** — all-or-nothing consumption, persistence between turns, house limits (3 normal, 5 garden, ∞ prédio)
- **Tile system** — 5×5 grid per tile, road crossings without connection, inter-tile connection by orthogonal adjacency
- **Supply piles** — 222 cards total, 1x restriction for 10 specific high-tier employees
- **CFO** — rounds **down** (not up!), bankruptcy rules, mandatory action

The apartment building from the expansion was a fun surprise: a 3×3 structure with infinite demand slots that generates 2 tokens per campaign. I've decided to start implementing them right away. And the house numbers π and 9¾ (yes, Harry Potter style) that resolve between houses 3-4 and 9-10.

---

### Game Engine Foundation

Rewrote all MVC components to use the real game architecture:

- **`model/GameState.js`**: 7-phase turn machine, 18 milestones with all effects implemented, payday with salary/discount calculation, sale processing with CFO bonus + waitress income + garden multiplier, bank depletion end-game
- **`view/GameView.js`**: Org chart tree rendering with depth-based indentation and branch colors, phase bar with active/completed states, hiring modal with supply counts, training modal
- **`controller/GameController.js`**: Phase-specific button labels, restructuring interactions (click to assign/unassign), keyboard shortcuts (H=hire, Enter=advance, Esc=close modals)

All integration tests passed via Node.js: phase cycling, milestone auto-triggering, pricing effects, serialization roundtrip.

---

### Aesthetic Pivot: Brutalist → Mid-Century Diner

Killed the Brutalist/Retro look in favor of a **Mid-Century American Diner** aesthetic (1940s–1950s):

| Element | Style |
|---|---|
| Colors | `#BF4646` diner red · `#EDDCC6` warm cream · `#FFF4EA` off-white · `#7EACB5` retro teal |
| Typography | Fredoka One (headlines) · Nunito (body) |
| UI | Rounded corners, chrome accents, warm shadows |
| Vibe | Café menus, Route 66 signage, vintage Coca-Cola |

Documented in the new `DESIGN.md`.

---

### Architecture Decision: The "Same JS" Trick

The biggest architectural decision: **same GameState.js runs everywhere**.

```
Phase 0–1: GameState.js runs in the Browser (sandbox)
Phase 3+:  GameState.js runs on the Server (multiplayer)
             ↕ (zero rewrite — same file, same logic)
```

For a turn-based board game, the server architecture is essentially a **CRUD app with WebSocket notifications**:

1. Server holds authoritative state
2. Only the active player can send actions
3. Server validates → updates state → broadcasts to all
4. No client-side prediction needed — no desync possible

The 5-phase roadmap:

| Phase | Deliverable | Risk |
|---|---|---|
| 0 | Design system + data structures | Zero |
| 1 | Full game engine (hot-seat sandbox) | Low-Medium |
| 2 | Node.js + Socket.io + room system | Low |
| 3 | Server authority multiplayer | Medium |
| 4 | Reconnection, spectators, AI | Medium |

### 💬 Real talk...

Today's rules session was completely exhausting, I was honestly fed up with it, but I know it was all incredibly valuable. I keep finding layers of complexity I hadn't anticipated — simple game nuances I hadn't noticed until a more rigorous analysis, things like the "First to Have $100" milestone only kicking in on the *next* Dinnertime and forcing you to fire your existing CFO, which I had never realized before.

The architecture decision feels right though. By building the engine as a single-player sandbox first, I can test every rule interaction without any networking complexity. Then wrapping it with Socket.io is just plumbing — the game logic doesn't change at all.

Time to code. 🍔

---

**Stack:** `HTML` · `CSS` · `JavaScript` · `MVC` · `Node.js` · `Socket.io` (planned)

`#gamedev` `#boardgames` `#javascript` `#indiedev` `#foodchainmagnate` `#devdiary`

---

## Entry #3 — Roadmap & Prioritization (February 18, 2026)

### Status Check
After auditing the current codebase and rules documentation, I've established a prioritized roadmap. The goal is to tackle **"Quick Wins"** (visual feedback) first to maintain momentum, followed by the complex game logic required for a playable MVP.

### The Roadmap

1. **Drink Visuals**
   - **Complexity:** 🟢 Low | **Impact:** Medium
   - Separate the generic "Drinks" counter into individual 🍺 Beer, 🥤 Coke, and 🍋 Lemonade icons.
2. **UI Polish**
   - **Complexity:** 🟢 Low | **Impact:** Low
   - Milestone badges and better notification animations.
3. **Manual Turn Choice**
   - **Complexity:** 🟡 Medium | **Impact:** Medium
   - Interactivity for the *Order of Business* phase.
4. **Bank Reserve**
   - **Complexity:** 🟡 Medium | **Impact:** High
   - Ending game triggers and setup choices.
5. **Expansion Support**
   - **Complexity:** 🟡 Medium | **Impact:** Medium
   - Adding *The Ketchup Mechanism* cards and effects.
6. **Visual OrgChart**
   - **Complexity:** 🟠 High | **Impact:** Medium-High
   - Moving from an indented list to a full SVG/Canvas tree with curved connection lines.
7. **Marketing, Map & Dinnertime**
   - **Complexity:** 🔴 High | **Impact:** Critical
   - Implementing `MarketingResolver.js`, BFS pathfinding, and the core `DinnertimeResolver.js`.

**Next**: Implementing specific icons for the inventory so players can tell their beer from their lemonade.

### 💬 Real talk...

Since today was Sunday (and we're in the peak of Carnival!), I was busy recovering from a massive Brazilian feijoada, so I pretty much just took a small peek at the roadmap and that's it. But focusing on the roadmap today was a necessary "ego check." With my background in UX design, I know that getting the visual feedback right early on is crucial for the developer experience too. It's tempting to jump straight into the BFS pathfinding...

Splitting the generic drinks into Coke, Beer, and Lemonade sounds simple, but it's the first step in making the player dashboard feel like a real game and not just a spreadsheet. Better to have a pretty, functional UI while I'm smashing my head against the pathfinding logic later this week.

---

**Stack:** `HTML` · `CSS` · `JavaScript` · `MVC` · `Node.js` · `Socket.io` (planned)

`#gamedev` `#boardgames` `#javascript` `#indiedev` `#foodchainmagnate` `#devdiary`

---

## Entry #4 — Information Centers & UI Refinement (February 24–25, 2026)

### Phase 2: Information Centers
Implemented dedicated modals for heavy-duty game data to keep the main dashboard clean:

- **Milestone Viewer**: A full-grid view of all 18 milestones. States: Claimed (with owner tag), Available, and Unavailable (beginner mode restrictions).
- **Career Path (The Trail)**: Reimagined the career tree. Instead of a vertical list, it's now a **horizontal path layout** with lanes per branch.
    - **Visual Connectors**: Arrows (→) between steps in the same branch indicate training progression.
    - **Minimalism**: Cleaned up the cards by removing redundant supply counts and "cross-branch" text.
    - **Salary Indicators**: Replaced text badges with a dynamic **💸 (Flying Money)** emoji for any employee that costs $5/turn.

### Rule Polish
- **Marketing Trainee**: Corrected rules regarding billboard duration (removed the "permanent" tag from the UI as it was misleading).
- **UX**: Massive increase in "white space" (airiness) within modals. The Career Path now uses an XL-gap layout to feel more like a premium board game interface.

**Next**: Map interaction and Dinnertime resolution.

---

**Stack:** `HTML` · `CSS` · `JavaScript` · `MVC` · `Node.js` · `Socket.io` (planned)

`#gamedev` `#boardgames` `#javascript` `#indiedev` `#foodchainmagnate` `#devdiary`
