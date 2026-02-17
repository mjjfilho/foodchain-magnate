// Food Chain Magnate - Controller: GameController
// Orchestrates Model (GameState) and View (GameView)
// Handles user intent → Model mutation → View update

class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this._initialize();
    }

    _initialize() {
        // Initial render
        this._renderAll();

        // Wire up UI event listeners
        this._attachEventListeners();

        // Add quick action buttons
        this.view.addQuickAction('Hire (H)', () => this._openCardShop());

        // Listen to model changes (Observer pattern)
        this.model.onChange((eventType, data) => {
            this._handleModelEvent(eventType, data);
        });

        // Welcome message
        setTimeout(() => {
            this.view.showNotification('Welcome to Food Chain Magnate! Press H to hire employees.', 'success');
        }, 500);
    }

    // --- Full Render ---

    _renderAll() {
        this.view.renderMap(this.model.getMap(), (row, col) => this._onCellClick(row, col));
        this._updateDashboard();
        this.view.updatePhaseDisplay(this.model.getPhase(), this.model.state.currentPlayer);
    }

    _updateDashboard() {
        const player = this.model.getCurrentPlayer();
        this.view.updateDashboard(player);
    }

    // --- Event Handlers (User Intent) ---

    _onCellClick(row, col) {
        const cell = this.model.getCell(row, col);
        if (!cell) return;

        if (cell.type === 'empty') {
            const buildingType = prompt('Place building (restaurant/garden):');
            if (buildingType === 'restaurant' || buildingType === 'garden') {
                const result = this.model.placeBuilding(
                    row, col, buildingType, this.model.state.currentPlayer
                );

                if (result.success) {
                    this.view.renderMap(this.model.getMap(), (r, c) => this._onCellClick(r, c));
                    this.view.showNotification(`${buildingType} placed!`);
                }
            }
        } else if (cell.type === 'house' && cell.demand) {
            alert(`House Demand:\n🍔 Burgers: ${cell.demand.burgers}\n🍕 Pizza: ${cell.demand.pizza}\n🥤 Drinks: ${cell.demand.drinks}`);
        }
    }

    _openCardShop() {
        const cards = this.model.getAvailableCards();
        this.view.showCardShop(cards, (card) => this._onHireCard(card));
    }

    _onHireCard(card) {
        const result = this.model.hireEmployee(this.model.state.currentPlayer, card.id);

        if (result.success) {
            this.view.showNotification(`Hired ${card.name}!`);
            this._updateDashboard();
        } else if (result.reason === 'no_money') {
            this.view.showNotification('Not enough money!', 'error');
        }
    }

    _onEndTurn() {
        // Calculate dinner if in dinner phase
        if (this.model.getPhase() === 'dinner') {
            const revenue = this.model.calculateDinner();
            this.view.showNotification(`Dinner complete! Revenue: $${revenue}`);
        }

        // Advance phase
        const nextPhase = this.model.nextPhase();

        // Update all displays
        this.view.updatePhaseDisplay(nextPhase, this.model.state.currentPlayer);
        this._updateDashboard();
        this.view.showNotification(`Now in ${nextPhase} phase`);
    }

    // --- Model Event Handler (Observer) ---

    _handleModelEvent(eventType, data) {
        // React to model changes if needed
        // Currently handled inline, but this allows future decoupling
        switch (eventType) {
            case 'player_changed':
                this._updateDashboard();
                break;
        }
    }

    // --- DOM Event Listeners ---

    _attachEventListeners() {
        // End turn button
        document.getElementById('end-turn-btn').addEventListener('click', () => {
            this._onEndTurn();
        });

        // Close shop button
        document.getElementById('close-shop-btn').addEventListener('click', () => {
            this.view.hideCardShop();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'h') {
                this._openCardShop();
            } else if (e.key === 'Escape') {
                this.view.hideCardShop();
            } else if (e.key === 'Enter') {
                this._onEndTurn();
            }
        });
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameController;
}
