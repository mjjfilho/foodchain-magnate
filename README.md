# 🍔 Food Chain Magnate Online

A web-based implementation of the strategic board game Food Chain Magnate with real-time multiplayer capabilities.

## 🎮 Features

### Current Implementation (MVP 1 - Sandbox Mode)
- ✅ **Interactive 8x8 Game Board** with houses, restaurants, and gardens
- ✅ **Player Dashboard** showing money, employees, and inventory
- ✅ **Hiring System** with 8 different employee types
- ✅ **Turn-Based Phases** (Setup → Hiring → Marketing → Production → Dinner → Payday → Cleanup)
- ✅ **Inventory Management** for burgers, pizza, and drinks
- ✅ **Building Placement** on the game map
- ✅ **Brutalist/Retro Aesthetic** with vibrant colors and smooth animations

## 🚀 Getting Started

### Quick Start
1. Open `index.html` in your web browser
2. Press **H** to open the hiring menu
3. Click on the map to place buildings
4. Press **Enter** to end your turn

### Keyboard Shortcuts
- **H** - Open hiring menu
- **Enter** - End turn / Next phase
- **Escape** - Close modals

### Debug Commands (Console)
```javascript
produceFood("burgers")  // Add a burger to inventory
produceFood("pizza")    // Add a pizza to inventory
produceFood("drinks")   // Add a drink to inventory
addMoney(50)            // Add $50 to current player
```

## 📋 Game Phases

1. **Setup** - Initial game setup
2. **Hiring** - Hire new employees
3. **Marketing** - Place marketing campaigns
4. **Production** - Produce food and drinks
5. **Dinner** - Customers buy from restaurants
6. **Payday** - Pay employee salaries
7. **Cleanup** - Reset for next turn

## 🎨 Design Philosophy

The game uses a **Brutalist/Retro aesthetic** featuring:
- Bold, vibrant color palette (Orange, Yellow gradients)
- Monospace typography (Courier New)
- Strong borders and shadows
- Smooth micro-animations
- Dark mode by default

## 🗺️ Roadmap

### Phase 1: Project Setup ✅
- [x] Initialize project structure
- [x] Create HTML/CSS/JS files
- [x] Implement basic game engine

### Phase 2: Core Game Engine (In Progress)
- [x] Game state management
- [x] Turn phase system
- [x] Basic organization chart
- [ ] Complete milestone tracking
- [ ] Full dinner phase logic

### Phase 3: Map & Board
- [x] 2D grid map system
- [x] Tile placement logic
- [x] Player board components
- [x] Inventory management

### Phase 4: UI Components
- [x] Card components
- [x] Interactive map view
- [x] Player dashboard
- [x] Hiring interface
- [ ] Marketing placement UI
- [ ] Production interface

### Phase 5: Multiplayer & Polish
- [ ] WebSocket server setup
- [ ] Real-time state synchronization
- [ ] Advanced animations
- [ ] Custom game assets
- [ ] Sound effects

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Future**: Node.js + WebSockets for multiplayer
- **Potential**: boardgame.io framework for advanced features

## 📝 Employee Types

1. **Recruiting Girl** ($3) - Hire 1 employee
2. **Trainer** ($5) - Train 1 employee
3. **Burger Chef** ($5) - Produce burgers
4. **Pizza Chef** ($5) - Produce pizza
5. **Errand Boy** ($3) - Deliver food
6. **Waitress** ($4) - Serve customers
7. **Marketing Manager** ($8) - Market to 2 houses
8. **CEO** ($15) - Manage all operations

## 🎯 Current Status

**MVP 1 (Sandbox Mode)** - ✅ Complete
- Single-player mode functional
- Basic hiring and placement working
- Turn system implemented

**Next Steps**: Implement full dinner phase logic with distance calculation and price competition.

## 📄 License

This is a fan-made implementation for educational purposes. Food Chain Magnate is designed by Jeroen Doumen and Joris Wiersinga, published by Splotter Spellen.

---

**Made with ❤️ for board game enthusiasts**
