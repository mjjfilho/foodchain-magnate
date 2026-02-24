// Food Chain Magnate - View: GameView
// Renders game state to DOM — no game logic, only presentation
// Diner aesthetic with org chart tree, phase bar, beach section

class GameView {
    constructor() {
        this.elements = {
            // Header
            currentPhase: document.getElementById('current-phase'),
            currentTurn: document.getElementById('current-turn'),
            currentPlayer: document.getElementById('current-player'),
            phaseBar: document.getElementById('phase-bar'),
            bankBalance: document.getElementById('bank-balance'),

            // Map
            mapGrid: document.getElementById('map-grid'),

            // Dashboard
            playerMoney: document.getElementById('player-money'),
            burgerCount: document.getElementById('burger-count'),
            pizzaCount: document.getElementById('pizza-count'),
            beerCount: document.getElementById('beer-count'),
            cokeCount: document.getElementById('coke-count'),
            lemonadeCount: document.getElementById('lemonade-count'),
            orgChartTree: document.getElementById('org-chart-tree'),
            beachEmployees: document.getElementById('beach-employees'),
            milestoneBadges: document.getElementById('milestone-badges'),

            // Modals
            cardShopModal: document.getElementById('card-shop-modal'),
            availableCards: document.getElementById('available-cards'),
            trainingModal: document.getElementById('training-modal'),
            trainingOptions: document.getElementById('training-options'),

            // Actions
            endTurnBtn: document.getElementById('end-turn-btn'),
        };
    }

    // ═══════════════════════════════════════════
    // PHASE BAR
    // ═══════════════════════════════════════════

    updatePhaseBar(currentPhase, phases) {
        const steps = this.elements.phaseBar.querySelectorAll('.phase-step');
        const currentIdx = phases.indexOf(currentPhase);

        steps.forEach((step, i) => {
            step.classList.remove('active', 'completed');
            if (i === currentIdx) {
                step.classList.add('active');
            } else if (i < currentIdx) {
                step.classList.add('completed');
            }
        });
    }

    updateHeader(phase, turn, playerName) {
        const phaseNames = {
            restructuring: 'Restructuring',
            order_of_business: 'Order of Business',
            working: 'Working 9-5',
            dinnertime: 'Dinnertime',
            payday: 'Payday',
            marketing_campaigns: 'Marketing',
            cleanup: 'Cleanup',
        };
        this.elements.currentPhase.textContent = `Phase: ${phaseNames[phase] || phase}`;
        this.elements.currentTurn.textContent = `Turn: ${turn}`;
        this.elements.currentPlayer.textContent = `🎮 ${playerName}`;
    }

    updateBank(bankAmount) {
        this.elements.bankBalance.textContent = `🏦 Bank: $${bankAmount}`;
    }

    // ═══════════════════════════════════════════
    // PLAYER DASHBOARD
    // ═══════════════════════════════════════════

    updateDashboard(player) {
        this.elements.playerMoney.textContent = player.money;
        this.elements.burgerCount.textContent = player.inventory.burger;
        this.elements.pizzaCount.textContent = player.inventory.pizza;
        this.elements.beerCount.textContent = player.inventory.beer;
        this.elements.cokeCount.textContent = player.inventory.coke;
        this.elements.lemonadeCount.textContent = player.inventory.lemonade;
    }

    // ═══════════════════════════════════════════
    // ORG CHART TREE
    // ═══════════════════════════════════════════

    renderOrgChart(orgChart, onNodeClick, onSlotClick) {
        const container = this.elements.orgChartTree;
        container.innerHTML = '';

        const ceo = orgChart.getCEO();
        if (!ceo) return;

        const ceoDiv = this._createOrgNode(ceo, 0, onNodeClick);
        container.appendChild(ceoDiv);

        // Render children recursively
        this._renderChildren(orgChart, ceo, ceoDiv, 1, onNodeClick);

        // Show empty slots
        const openSlots = ceo.maxChildren - ceo.children.length;
        for (let i = 0; i < openSlots; i++) {
            const slotDiv = this._createEmptySlot(ceo.nodeId, onSlotClick);
            container.appendChild(slotDiv);
        }
    }

    _renderChildren(orgChart, parentNode, parentDiv, depth, onNodeClick) {
        for (const childId of parentNode.children) {
            const child = orgChart.getNode(childId);
            if (!child) continue;

            const childDiv = this._createOrgNode(child, depth, onNodeClick);
            parentDiv.after(childDiv);

            this._renderChildren(orgChart, child, childDiv, depth + 1, onNodeClick);
        }
    }

    _createOrgNode(node, depth, onNodeClick) {
        const emp = typeof getEmployee !== 'undefined' ? getEmployee(node.employeeId) : null;
        const branch = emp ? emp.branch : 'management';
        const name = emp ? emp.name : node.employeeId;
        const icon = typeof BRANCHES !== 'undefined' && BRANCHES[branch] ? BRANCHES[branch].icon : '📋';

        const div = document.createElement('div');
        div.className = 'employee-card';
        div.dataset.branch = branch;
        div.dataset.nodeId = node.nodeId;
        div.style.marginLeft = `${depth * 16}px`;

        const slotsInfo = node.maxChildren > 0
            ? ` · ${node.children.length}/${node.maxChildren}`
            : '';

        div.innerHTML = `
            <div class="card-name">${icon} ${name}</div>
            <div class="card-info">${branch}${slotsInfo}</div>
        `;

        if (onNodeClick) {
            div.addEventListener('click', () => onNodeClick(node));
        }

        return div;
    }

    _createEmptySlot(parentNodeId, onSlotClick) {
        const div = document.createElement('div');
        div.className = 'employee-card';
        div.style.borderStyle = 'dashed';
        div.style.opacity = '0.5';
        div.style.marginLeft = '16px';
        div.innerHTML = `
            <div class="card-name">➕ Empty slot</div>
            <div class="card-info">Assign during Restructuring</div>
        `;

        if (onSlotClick) {
            div.addEventListener('click', () => onSlotClick(parentNodeId));
        }

        return div;
    }

    // ═══════════════════════════════════════════
    // BEACH
    // ═══════════════════════════════════════════

    renderBeach(beachEmployees, onBeachClick) {
        const container = this.elements.beachEmployees;
        container.innerHTML = '';

        if (beachEmployees.length === 0) {
            container.innerHTML = '<span class="beach-label">🌊 No employees on the beach</span>';
            return;
        }

        for (const entry of beachEmployees) {
            const emp = typeof getEmployee !== 'undefined' ? getEmployee(entry.employeeId) : null;
            const name = emp ? emp.name : entry.employeeId;
            const branch = emp ? emp.branch : 'management';
            const icon = typeof BRANCHES !== 'undefined' && BRANCHES[branch] ? BRANCHES[branch].icon : '📋';

            const badge = document.createElement('div');
            badge.className = 'employee-card';
            badge.dataset.branch = branch;
            badge.style.fontSize = '0.85rem';
            badge.innerHTML = `<div class="card-name">${icon} ${name}</div>`;

            if (onBeachClick) {
                badge.addEventListener('click', () => onBeachClick(entry));
            }

            container.appendChild(badge);
        }
    }

    // ═══════════════════════════════════════════
    // HIRING MODAL
    // ═══════════════════════════════════════════

    showHiringModal(hireableEmployees, onHireClick) {
        const { cardShopModal, availableCards } = this.elements;
        availableCards.innerHTML = '';

        if (hireableEmployees.length === 0) {
            availableCards.innerHTML = '<p style="text-align:center; color: var(--warm-gray);">No employees available in supply.</p>';
        }

        for (const emp of hireableEmployees) {
            const card = document.createElement('div');
            card.className = 'employee-card';
            card.dataset.branch = emp.branch;
            card.style.cursor = 'pointer';

            const icon = typeof BRANCHES !== 'undefined' && BRANCHES[emp.branch] ? BRANCHES[emp.branch].icon : '📋';

            card.innerHTML = `
                <div class="card-name">${icon} ${emp.name}</div>
                <div class="card-info">
                    ${emp.branch} · Level ${emp.level}
                </div>
                <div class="card-info" style="color: var(--retro-teal-dark);">
                    Supply: ${emp.currentSupply}
                </div>
            `;

            card.addEventListener('click', () => onHireClick(emp));
            availableCards.appendChild(card);
        }

        cardShopModal.classList.remove('hidden');
    }

    hideHiringModal() {
        this.elements.cardShopModal.classList.add('hidden');
    }

    // ═══════════════════════════════════════════
    // TRAINING MODAL
    // ═══════════════════════════════════════════

    showTrainingModal(beachEmployee, validPromotions, onTrainClick) {
        const { trainingModal, trainingOptions } = this.elements;
        trainingOptions.innerHTML = '';

        const currentEmp = typeof getEmployee !== 'undefined' ? getEmployee(beachEmployee.employeeId) : null;
        const currentName = currentEmp ? currentEmp.name : beachEmployee.employeeId;

        // Header
        const header = document.createElement('p');
        header.style.cssText = 'text-align: center; margin-bottom: var(--space-md); font-weight: 700;';
        header.textContent = `Training: ${currentName}`;
        trainingOptions.appendChild(header);

        if (validPromotions.length === 0) {
            trainingOptions.innerHTML += '<p style="text-align:center; color: var(--warm-gray);">No valid promotions available.</p>';
        }

        for (const targetId of validPromotions) {
            const targetEmp = typeof getEmployee !== 'undefined' ? getEmployee(targetId) : null;
            if (!targetEmp) continue;

            const icon = typeof BRANCHES !== 'undefined' && BRANCHES[targetEmp.branch] ? BRANCHES[targetEmp.branch].icon : '📋';

            const card = document.createElement('div');
            card.className = 'employee-card';
            card.dataset.branch = targetEmp.branch;
            card.style.cursor = 'pointer';
            card.innerHTML = `
                <div class="card-name">${icon} ${targetEmp.name}</div>
                <div class="card-info">${targetEmp.branch} · Level ${targetEmp.level} · $${targetEmp.salary}/turn</div>
            `;

            card.addEventListener('click', () => onTrainClick(beachEmployee, targetId));
            trainingOptions.appendChild(card);
        }

        trainingModal.classList.remove('hidden');
    }

    hideTrainingModal() {
        this.elements.trainingModal.classList.add('hidden');
    }

    // ═══════════════════════════════════════════
    // MAP (placeholder — will be replaced by MapState renderer in Phase 1b)
    // ═══════════════════════════════════════════

    renderMap(onCellClick) {
        const { mapGrid } = this.elements;
        mapGrid.innerHTML = '';

        // Simple 8x8 placeholder grid
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;

                // Some placeholder houses
                if ((row === 2 && col === 2) || (row === 2 && col === 5) ||
                    (row === 5 && col === 2) || (row === 5 && col === 5)) {
                    cell.classList.add('house');
                    cell.textContent = '🏠';
                }

                if (onCellClick) {
                    cell.addEventListener('click', () => onCellClick(row, col));
                }

                mapGrid.appendChild(cell);
            }
        }
    }

    // ═══════════════════════════════════════════
    // MILESTONES
    // ═══════════════════════════════════════════

    renderMilestones(milestonesOwned) {
        const container = this.elements.milestoneBadges;
        if (!container) return;
        container.innerHTML = '';

        if (!milestonesOwned || milestonesOwned.length === 0) {
            container.innerHTML = '<span class="no-milestones">— None yet —</span>';
            return;
        }

        // Human-readable labels and categories for each milestone
        const MILESTONE_META = {
            first_train: { label: 'First to Train', cat: 'training' },
            first_hire_3: { label: 'First to Hire 3', cat: 'recruiting' },
            first_pay_20_salary: { label: 'Pay $20 Salary', cat: 'finance' },
            first_waitress: { label: 'First Waitress', cat: 'service' },
            first_20_cash: { label: 'First $20', cat: 'finance' },
            first_100_cash: { label: 'First $100', cat: 'finance' },
            first_errand_boy: { label: 'First Errand Boy', cat: 'logistics' },
            first_cart_operator: { label: 'First Cart Operator', cat: 'logistics' },
            first_burger_produced: { label: 'First Burger', cat: 'kitchen' },
            first_pizza_produced: { label: 'First Pizza', cat: 'kitchen' },
            first_throw_away: { label: 'First to Waste', cat: 'management' },
            first_lower_prices: { label: 'First to Lower Prices', cat: 'pricing' },
            first_burger_marketed: { label: 'Burger Marketer', cat: 'marketing' },
            first_pizza_marketed: { label: 'Pizza Marketer', cat: 'marketing' },
            first_drink_marketed: { label: 'Drink Marketer', cat: 'marketing' },
            first_billboard: { label: 'First Billboard', cat: 'marketing' },
            first_airplane: { label: 'First Airplane', cat: 'marketing' },
            first_radio: { label: 'First Radio', cat: 'marketing' },
        };

        for (const milestoneId of milestonesOwned) {
            const meta = MILESTONE_META[milestoneId] || { label: milestoneId, cat: 'management' };
            const badge = document.createElement('span');
            badge.className = 'milestone-badge';
            badge.dataset.cat = meta.cat;
            badge.title = milestoneId; // tooltip with raw ID for debugging
            badge.textContent = `🏆 ${meta.label}`;
            container.appendChild(badge);
        }
    }

    // ═══════════════════════════════════════════
    // NOTIFICATIONS
    // ═══════════════════════════════════════════

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameView;
}
