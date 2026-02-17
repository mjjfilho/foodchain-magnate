# 🍔 Food Chain Magnate Online

A web-based implementation of the cult classic board game [Food Chain Magnate](https://boardgamegeek.com/boardgame/175914/food-chain-magnate) with real-time multiplayer. Build your fast-food empire, outmaneuver rivals, and dominate the market.

> **Status**: 📋 Pre-production — rules finalized, architecture planned, implementation starting.

---

## 🎯 What Is This?

Food Chain Magnate is a heavy economic strategy board game by Splotter Spellen. Players build fast-food corporations by hiring employees, training them up career trees, marketing to neighborhoods, and competing to serve demand generated across a modular tile map.

This project implements the **full base game + The Ketchup Mechanism expansion** as a browser-based multiplayer experience.

---

## 🎨 Aesthetic

**Mid-Century American Diner** (1940s–1950s) — vintage Americana, Streamline Moderne curves, pin-up advertising influence.

| | |
|---|---|
| 🔴 `#BF4646` Diner Red | 🟢 `#7EACB5` Retro Teal |
| 🟡 `#EDDCC6` Warm Cream | ⚪ `#FFF4EA` Off-White |

Typography: **Fredoka One** (headlines) · **Nunito** (body)

Full design system in [`DESIGN.md`](DESIGN.md).

---

## 🗺️ Roadmap

| Phase | Description | Status |
|---|---|---|
| **0** | Design system + employee data structures | ⬜ Next |
| **1** | Game engine — single-player sandbox (hot-seat) | ⬜ |
| **2** | Node.js server + Socket.io room system | ⬜ |
| **3** | Server authority multiplayer | ⬜ |
| **4** | Reconnection, spectators, AI, persistence | ⬜ |

### Architecture

```
Phase 0–1: GameState.js runs in the Browser (sandbox)
Phase 3+:  GameState.js runs on the Server (multiplayer)
             ↕ same file, zero rewrite
```

The game engine is the **same JavaScript code** in both modes. For a turn-based board game, multiplayer is just "CRUD with WebSocket notifications" — the server validates actions and broadcasts state. No client-side prediction, no desync.

---

## 📋 Game Overview

- **2–5 players** on a modular tile map (3×3 to 5×4)
- **7 phases per turn**: Restructuring → Order of Business → Working 9-5 → Dinnertime → Payday → Marketing Campaigns → Cleanup
- **~25 employee types** across 8 career branches (management, kitchen, marketing, logistics, pricing, recruitment, training, service)
- **18 base milestones** + **17 expansion milestones** (first-mover permanent bonuses)
- **Dinnertime** as core economic loop: attractiveness = unit price + distance

Full rules specification in [`RULES.md`](RULES.md).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML + CSS + JavaScript (MVC) |
| Backend | Node.js + Express + Socket.io |
| Auth | Nickname-based (no database initially) |
| Deploy | Render.com / Railway (planned) |

---

## 🚀 Getting Started

### Quick Start (Phase 0–1: Sandbox)
```bash
# No build step — just open in browser
open index.html
```

### Multiplayer (Phase 2+)
```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## 📁 Project Structure

```
FoodchainMagnate/
├── index.html              # Entry point
├── app.js                  # Bootstrap (MVC wiring)
├── styles.css              # Design system
├── model/
│   ├── GameState.js        # Core game state + phase machine
│   ├── EmployeeData.js     # Career tree DAG (planned)
│   ├── OrgChart.js         # Player org chart (planned)
│   ├── MapState.js         # Tile map + pathfinding (planned)
│   ├── DinnertimeResolver.js  # Demand matching (planned)
│   └── MarketingResolver.js   # Campaign logic (planned)
├── view/
│   └── GameView.js         # DOM rendering
├── controller/
│   └── GameController.js   # Input handling + model↔view
├── server/                 # (Phase 2+)
│   ├── index.js            # Express + Socket.io
│   ├── RoomManager.js      # Room creation/joining
│   └── GameSession.js      # Server-side game wrapper
├── RULES.md                # Complete game rules specification
├── DESIGN.md               # Visual design system
└── DEVLOG.md               # Development diary
```

---

## 📝 Dev Diary

Development progress is documented in [`DEVLOG.md`](DEVLOG.md) (English + Português).

---

## 📄 License

Fan-made implementation for educational purposes. Food Chain Magnate is designed by Jeroen Doumen and Joris Wiersinga, published by [Splotter Spellen](https://www.splottershop.com/).

---

**Made with ❤️ and 🍔 for board game enthusiasts**
