// Food Chain Magnate - View: GameView
// Pure DOM rendering — receives data, outputs HTML. No game logic.

class GameView {
    constructor() {
        // Cache DOM references
        this.elements = {
            mapGrid: document.getElementById('map-grid'),
            playerMoney: document.getElementById('player-money'),
            burgerCount: document.getElementById('burger-count'),
            pizzaCount: document.getElementById('pizza-count'),
            drinkCount: document.getElementById('drink-count'),
            employeeSlots: document.getElementById('employee-slots'),
            currentPhase: document.getElementById('current-phase'),
            currentPlayer: document.getElementById('current-player'),
            cardShopModal: document.getElementById('card-shop-modal'),
            availableCards: document.getElementById('available-cards'),
            actionsDiv: document.querySelector('.actions')
        };
    }

    // --- Map Rendering ---

    renderMap(map, onCellClick) {
        const { mapGrid } = this.elements;
        mapGrid.innerHTML = '';

        const tileIcons = {
            house: '🏠',
            restaurant: '🍔',
            garden: '🌳'
        };

        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map[row].length; col++) {
                const cell = map[row][col];
                const cellDiv = document.createElement('div');
                cellDiv.className = `grid-cell ${cell.type}`;
                cellDiv.dataset.row = row;
                cellDiv.dataset.col = col;

                if (tileIcons[cell.type]) {
                    cellDiv.textContent = tileIcons[cell.type];
                }

                cellDiv.addEventListener('click', () => onCellClick(row, col));
                mapGrid.appendChild(cellDiv);
            }
        }
    }

    // --- Player Dashboard ---

    updateDashboard(player) {
        this.elements.playerMoney.textContent = player.money;
        this.elements.burgerCount.textContent = player.inventory.burgers;
        this.elements.pizzaCount.textContent = player.inventory.pizza;
        this.elements.drinkCount.textContent = player.inventory.drinks;
        this.renderEmployees(player.employees);
    }

    renderEmployees(employees, onEmployeeClick) {
        const { employeeSlots } = this.elements;
        employeeSlots.innerHTML = '';

        if (employees.length === 0) {
            employeeSlots.innerHTML = '<p style="color: #888; text-align: center;">No employees hired yet</p>';
            return;
        }

        employees.forEach((employee, index) => {
            const card = document.createElement('div');
            card.className = 'employee-card';
            card.innerHTML = `
                <strong>${employee.name}</strong>
                <div style="font-size: 0.9rem; margin-top: 0.3rem;">
                    ${employee.type} | $${employee.cost}
                </div>
            `;

            if (onEmployeeClick) {
                card.addEventListener('click', () => onEmployeeClick(employee, index));
            }

            employeeSlots.appendChild(card);
        });
    }

    // --- Phase Display ---

    updatePhaseDisplay(phase, currentPlayer) {
        this.elements.currentPhase.textContent = `Phase: ${phase}`;
        this.elements.currentPlayer.textContent = `Player: ${currentPlayer}`;
    }

    // --- Card Shop ---

    showCardShop(cards, onCardClick) {
        const { cardShopModal, availableCards } = this.elements;
        availableCards.innerHTML = '';

        cards.forEach(card => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'employee-card';
            cardDiv.innerHTML = `
                <strong>${card.name}</strong>
                <div style="font-size: 0.85rem; margin-top: 0.3rem;">
                    ${card.type}
                </div>
                <div style="font-size: 1rem; margin-top: 0.3rem; color: #FDC830;">
                    $${card.cost}
                </div>
            `;

            cardDiv.addEventListener('click', () => onCardClick(card));
            availableCards.appendChild(cardDiv);
        });

        cardShopModal.classList.remove('hidden');
    }

    hideCardShop() {
        this.elements.cardShopModal.classList.add('hidden');
    }

    // --- Notifications ---

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#FF6B35'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 4px;
            font-weight: bold;
            z-index: 2000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // --- Quick Actions ---

    addQuickAction(label, onClick) {
        const btn = document.createElement('button');
        btn.className = 'btn-secondary';
        btn.textContent = label;
        btn.style.marginBottom = '0.5rem';
        btn.addEventListener('click', onClick);
        this.elements.actionsDiv.insertBefore(btn, this.elements.actionsDiv.firstChild);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameView;
}
