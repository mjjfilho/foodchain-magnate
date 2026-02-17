// Food Chain Magnate - Model: GameState
// Pure game state and business logic — no DOM, no UI

class GameState {
    constructor() {
        this.phases = [
            'setup',
            'hiring',
            'marketing',
            'production',
            'dinner',
            'payday',
            'cleanup'
        ];

        this.state = {
            currentPhase: 'setup',
            currentPlayer: 1,
            turn: 1,
            players: [
                this._createPlayer(1, 'Player 1'),
                this._createPlayer(2, 'Player 2')
            ],
            map: this._initializeMap(),
            availableCards: this._initializeCards()
        };

        // Event listeners for state changes
        this._listeners = [];
    }

    // --- Observer Pattern ---

    onChange(callback) {
        this._listeners.push(callback);
    }

    _notify(eventType, data = {}) {
        this._listeners.forEach(cb => cb(eventType, data));
    }

    // --- Factory Methods ---

    _createPlayer(id, name) {
        return {
            id,
            name,
            money: 20,
            employees: [],
            inventory: { burgers: 0, pizza: 0, drinks: 0 },
            restaurants: [],
            milestones: []
        };
    }

    _initializeMap() {
        const map = [];
        for (let row = 0; row < 8; row++) {
            map[row] = [];
            for (let col = 0; col < 8; col++) {
                map[row][col] = {
                    type: 'empty',
                    owner: null,
                    building: null
                };
            }
        }

        // Place initial houses
        const housePositions = [[2, 2], [2, 5], [5, 2], [5, 5]];
        housePositions.forEach(([row, col]) => {
            map[row][col] = {
                type: 'house',
                owner: null,
                building: null,
                demand: {
                    burgers: Math.floor(Math.random() * 3) + 1,
                    pizza: Math.floor(Math.random() * 3) + 1,
                    drinks: Math.floor(Math.random() * 3) + 1
                }
            };
        });

        return map;
    }

    _initializeCards() {
        return [
            { id: 1, name: 'Recruiting Girl', type: 'hiring', cost: 3, ability: 'hire_1' },
            { id: 2, name: 'Trainer', type: 'training', cost: 5, ability: 'train_1' },
            { id: 3, name: 'Burger Chef', type: 'production', cost: 5, ability: 'produce_burger' },
            { id: 4, name: 'Pizza Chef', type: 'production', cost: 5, ability: 'produce_pizza' },
            { id: 5, name: 'Errand Boy', type: 'delivery', cost: 3, ability: 'deliver_1' },
            { id: 6, name: 'Waitress', type: 'service', cost: 4, ability: 'serve_1' },
            { id: 7, name: 'Marketing Manager', type: 'marketing', cost: 8, ability: 'market_2' },
            { id: 8, name: 'CEO', type: 'management', cost: 15, ability: 'manage_all' }
        ];
    }

    // --- Queries ---

    getCurrentPlayer() {
        return this.state.players.find(p => p.id === this.state.currentPlayer);
    }

    getPlayer(playerId) {
        return this.state.players.find(p => p.id === playerId);
    }

    getCell(row, col) {
        return this.state.map[row]?.[col] ?? null;
    }

    getPhase() {
        return this.state.currentPhase;
    }

    getTurn() {
        return this.state.turn;
    }

    getMap() {
        return this.state.map;
    }

    getAvailableCards() {
        return this.state.availableCards;
    }

    // --- Commands (mutate state + notify) ---

    hireEmployee(playerId, cardId) {
        const player = this.getPlayer(playerId);
        const card = this.state.availableCards.find(c => c.id === cardId);

        if (!player || !card) return { success: false, reason: 'invalid' };

        if (player.money < card.cost) {
            return { success: false, reason: 'no_money' };
        }

        player.money -= card.cost;
        player.employees.push({ ...card, trained: false });
        this._notify('employee_hired', { playerId, card });
        return { success: true, card };
    }

    placeBuilding(row, col, buildingType, playerId) {
        const cell = this.state.map[row]?.[col];
        if (!cell || cell.type !== 'empty') {
            return { success: false, reason: 'occupied' };
        }

        cell.type = buildingType;
        cell.owner = playerId;
        this._notify('building_placed', { row, col, buildingType, playerId });
        return { success: true };
    }

    produceFood(playerId, foodType) {
        const player = this.getPlayer(playerId);
        if (!player || player.inventory[foodType] === undefined) {
            return { success: false, reason: 'invalid' };
        }

        player.inventory[foodType]++;
        this._notify('food_produced', { playerId, foodType });
        return { success: true };
    }

    nextPhase() {
        const currentIndex = this.phases.indexOf(this.state.currentPhase);

        if (currentIndex < this.phases.length - 1) {
            this.state.currentPhase = this.phases[currentIndex + 1];
        } else {
            this.state.currentPhase = this.phases[0];
            this._nextPlayer();
        }

        this._notify('phase_changed', { phase: this.state.currentPhase });
        return this.state.currentPhase;
    }

    _nextPlayer() {
        if (this.state.currentPlayer < this.state.players.length) {
            this.state.currentPlayer++;
        } else {
            this.state.currentPlayer = 1;
            this.state.turn++;
        }
        this._notify('player_changed', { player: this.state.currentPlayer, turn: this.state.turn });
    }

    calculateDinner() {
        const player = this.getCurrentPlayer();
        let revenue = 0;

        revenue += player.inventory.burgers * 10;
        revenue += player.inventory.pizza * 12;
        revenue += player.inventory.drinks * 5;

        player.inventory.burgers = 0;
        player.inventory.pizza = 0;
        player.inventory.drinks = 0;

        player.money += revenue;

        this._notify('dinner_calculated', { revenue, playerId: player.id });
        return revenue;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameState;
}
