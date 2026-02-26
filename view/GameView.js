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
            hireBtn: document.getElementById('hire-btn'),
            phaseTip: document.getElementById('phase-tip'),
            // Info modals
            milestoneViewerModal: document.getElementById('milestone-viewer-modal'),
            milestoneViewerGrid: document.getElementById('milestone-viewer-grid'),
            // Career tree (new overlay-based modal)
            careerTreeOverlay: document.getElementById('career-tree-overlay'),
            careerTreeModal: document.getElementById('career-tree-modal'),
            careerTreeGrid: document.getElementById('career-tree-grid'),
            ctDetailPanel: document.getElementById('ct-detail-panel'),
            ctFooterSelected: document.getElementById('ct-footer-selected'),
            ctLegend: document.getElementById('ct-legend'),
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

    /**
     * Show/hide the Hire button based on current phase
     */
    setHireBtnVisible(visible) {
        const btn = this.elements.hireBtn;
        if (!btn) return;
        btn.classList.toggle('hidden', !visible);
    }

    /**
     * Show a contextual tip for the current phase
     */
    updatePhaseTip(phase) {
        const tips = {
            restructuring: '📄 Restructuring — assign or remove employees from the org chart. Click a chart node to send back to beach; click an empty slot to assign.',
            order_of_business: '📊 Order of Business — turn order is determined automatically (most open org slots goes first). Press End Phase to continue.',
            working: '💼 Working 9-5 — hire new employees or train beach employees. Use the “Hire” button or press H. Click a beach employee to train them.',
            dinnertime: '🍽️ Dinnertime — restaurants sell food to houses. (Automated for now — map system coming soon.)',
            payday: '💰 Payday — salaries are paid automatically. You may fire employees before paying by using the console.',
            marketing_campaigns: '📣 Marketing — place marketing pieces to generate demand tokens for next turn. (Coming soon.)',
            cleanup: '🧹 Cleanup — unsold food is discarded (unless you have a freezer). Starting next turn!',
        };
        const tip = this.elements.phaseTip;
        if (!tip) return;
        tip.textContent = tips[phase] || '';
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
    // MILESTONE VIEWER
    // ═══════════════════════════════════════════

    showMilestoneViewer(milestonesMap, players, beginnerMode = false) {
        const grid = this.elements.milestoneViewerGrid;
        if (!grid) return;
        grid.innerHTML = '';

        // All milestones with metadata
        const ALL_MILESTONES = [
            { id: 'first_hire_3', label: 'First to Hire 3', desc: 'Hire 3 employees total.', cat: 'recruiting' },
            { id: 'first_train', label: 'First to Train', desc: 'Train any employee.', cat: 'training' },
            { id: 'first_waitress', label: 'First Waitress', desc: 'Hire a Waitress.', cat: 'service' },
            { id: 'first_errand_boy', label: 'First Errand Boy', desc: 'Hire an Errand Boy.', cat: 'logistics' },
            { id: 'first_cart_operator', label: 'First Cart Operator', desc: 'Train to Cart Operator.', cat: 'logistics' },
            { id: 'first_burger_produced', label: 'First Burger Produced', desc: 'Produce at least 1 burger.', cat: 'kitchen' },
            { id: 'first_pizza_produced', label: 'First Pizza Produced', desc: 'Produce at least 1 pizza.', cat: 'kitchen' },
            { id: 'first_20_cash', label: 'First $20', desc: 'Reach $20 in cash.', cat: 'finance' },
            { id: 'first_100_cash', label: 'First $100', desc: 'Reach $100 in cash.', cat: 'finance' },
            { id: 'first_pay_20_salary', label: 'Pay $20 Salary', desc: 'Pay $20+ in salaries one turn.', cat: 'finance' },
            { id: 'first_lower_prices', label: 'First to Lower Prices', desc: 'Have a Discount/Pricing Manager.', cat: 'pricing' },
            { id: 'first_burger_marketed', label: 'Burger Marketer', desc: 'Place a burger marketing tile.', cat: 'marketing' },
            { id: 'first_pizza_marketed', label: 'Pizza Marketer', desc: 'Place a pizza marketing tile.', cat: 'marketing' },
            { id: 'first_drink_marketed', label: 'Drink Marketer', desc: 'Place a drink marketing tile.', cat: 'marketing' },
            { id: 'first_billboard', label: 'First Billboard', desc: 'Place a billboard.', cat: 'marketing' },
            { id: 'first_airplane', label: 'First Airplane', desc: 'Place an airplane tile.', cat: 'marketing' },
            { id: 'first_radio', label: 'First Radio', desc: 'Place a radio tile.', cat: 'marketing' },
            { id: 'first_throw_away', label: 'First to Waste Food', desc: 'Discard unsold food at Cleanup.', cat: 'management' },
        ];

        // Milestones unavailable in beginner mode
        const BEGINNER_LOCKED = ['first_airplane', 'first_radio', 'first_billboard'];

        for (const ms of ALL_MILESTONES) {
            const ownerId = milestonesMap ? milestonesMap[ms.id] : null;
            const isUnavailable = beginnerMode && BEGINNER_LOCKED.includes(ms.id);

            let state, icon, ownerLabel = '';
            if (isUnavailable) {
                state = 'unavailable'; icon = '\u274C';
            } else if (ownerId) {
                state = 'claimed'; icon = '\u2705';
                const owner = players ? players[ownerId] : null;
                ownerLabel = owner ? owner.name : ownerId;
            } else {
                state = 'available'; icon = '\u25EF';
            }

            const card = document.createElement('div');
            card.className = `ms-card ms-${state}`;
            card.dataset.cat = ms.cat;
            card.innerHTML = `
                <span class="ms-state-icon">${icon}</span>
                <div class="ms-info">
                    <strong class="ms-label">${ms.label}</strong>
                    <span class="ms-desc">${ms.desc}</span>
                    ${ownerLabel ? `<span class="ms-owner">👤 ${ownerLabel}</span>` : ''}
                </div>
                <span class="ms-cat-tag">${ms.cat}</span>
            `;
            grid.appendChild(card);
        }

        this.elements.milestoneViewerModal.classList.remove('hidden');
    }

    hideMilestoneViewer() {
        this.elements.milestoneViewerModal.classList.add('hidden');
    }

    // ═══════════════════════════════════════════
    // CAREER TREE MODAL (left-to-right tree)
    // ═══════════════════════════════════════════

    showCareerTreeModal() {
        const { careerTreeGrid, careerTreeOverlay, ctDetailPanel, ctFooterSelected, ctLegend } = this.elements;
        if (!careerTreeGrid) return;

        if (typeof EMPLOYEES === 'undefined' || typeof BRANCHES === 'undefined') {
            careerTreeGrid.innerHTML = '<p style="padding:16px">Employee data not available.</p>';
            careerTreeOverlay.classList.remove('hidden');
            return;
        }

        // ─── Reset state ───
        this._selectedCareerCardId = null;
        careerTreeGrid.innerHTML = '';
        ctFooterSelected.textContent = 'Nenhum selecionado';
        this._clearCareerDetailPanel();

        // ─── Build tree ───
        // Find roots: employees with no promotesFrom (entry-level or orphan)
        const roots = Object.values(EMPLOYEES).filter(e => e.promotesFrom.length === 0);

        // Render each root as its own sub-tree
        const treeRoot = document.createElement('div');
        treeRoot.className = 'ct-tree-root';

        // Render all roots stacked vertically in a single column wrapper
        const rootsCol = document.createElement('div');
        rootsCol.className = 'ct-column';
        treeRoot.appendChild(rootsCol);

        for (const emp of roots) {
            const group = this._renderCareerNode(emp);
            rootsCol.appendChild(group);
        }

        careerTreeGrid.appendChild(treeRoot);

        // ─── Legend ───
        this._renderCareerLegend();

        // ─── Close on overlay click ───
        careerTreeOverlay.onclick = (e) => {
            if (e.target === careerTreeOverlay) this.hideCareerTreeModal();
        };

        careerTreeOverlay.classList.remove('hidden');
    }

    /**
     * Returns the maximum depth of the subtree rooted at empId.
     * Leaf nodes return 0.
     */
    _getSubtreeDepth(empId) {
        const emp = EMPLOYEES[empId];
        if (!emp || emp.promotesTo.length === 0) return 0;
        return 1 + Math.max(...emp.promotesTo.map(id => this._getSubtreeDepth(id)));
    }

    /**
     * Sorts children so the deepest subtree lands at the center index.
     * This ensures align-items:center on the parent group aligns the parent card
     * horizontally with the main-chain card, not the arithmetic midpoint of all children.
     *
     * Algorithm: sort by depth descending, place heaviest at center, then alternate
     * left (above) and right (below) for the rest.
     *
     * Example with [NBD(0), LM(0), JVP(4)] → sorted desc [JVP,NBD,LM]
     *   center=1 → result = [NBD, JVP, LM]  ← JVP at center index ✓
     */
    _sortChildrenCentered(children) {
        if (children.length <= 1) return children;

        const sorted = [...children].sort(
            (a, b) => this._getSubtreeDepth(b.id) - this._getSubtreeDepth(a.id)
        );

        const result = new Array(children.length);
        const center = Math.floor(children.length / 2);
        result[center] = sorted[0]; // deepest at center

        let lo = center - 1;
        let hi = center + 1;
        for (let k = 1; k < sorted.length; k++) {
            if (lo >= 0) { result[lo--] = sorted[k++]; }
            if (k < sorted.length && hi < children.length) { result[hi++] = sorted[k]; }
        }

        return result.filter(Boolean);
    }

    /**
     * Recursively renders one employee node and its children (left-to-right).
     * Returns a .ct-node-group element.
     */
    _renderCareerNode(emp) {
        const branchDef = BRANCHES[emp.branch] || { color: '#999', label: emp.branch };
        const branchColor = branchDef.color;

        // ── Card ──
        const card = document.createElement('div');
        card.className = 'ct-node-card';
        card.style.setProperty('--ct-branch-color', branchColor);
        card.style.borderLeftColor = branchColor;

        const badges = [];
        if (emp.salary > 0) badges.push('<span class="ct-salary-icon" title="Paga salário">💸</span>');
        if (emp.is1x) badges.push('<span class="ct-badge-1x">1× Único</span>');

        card.innerHTML = `
            <span class="ct-card-name">${emp.name}</span>
            <div class="ct-card-badges">
                ${emp.salary > 0 ? '<span class="ct-salary-icon" title="Paga salário">💸</span>' : ''}
                ${emp.is1x ? '<span class="ct-badge-1x">1× Único</span>' : ''}
            </div>
        `;

        // ── Selection handler ──
        card.addEventListener('click', () => {
            const wasSelected = this._selectedCareerCardId === emp.id;

            document.querySelectorAll('.ct-node-card.selected')
                .forEach(c => c.classList.remove('selected'));

            if (wasSelected) {
                this._selectedCareerCardId = null;
                this._clearCareerDetailPanel();
                this.elements.ctFooterSelected.textContent = 'Nenhum selecionado';
            } else {
                this._selectedCareerCardId = emp.id;
                card.classList.add('selected');
                this._renderCareerDetailPanel(emp, branchColor);
                this.elements.ctFooterSelected.textContent = `Selecionado: ${emp.name}`;
            }
        });

        // ── Slot: card + optional horizontal connector ──
        const slot = document.createElement('div');
        slot.className = 'ct-node-slot';
        slot.appendChild(card);

        const rawChildren = (emp.promotesTo || []).map(id => EMPLOYEES[id]).filter(Boolean);
        // Sort so deepest subtree is at the center — fixes main-chain alignment
        const children = this._sortChildrenCentered(rawChildren);

        if (children.length > 0) {
            const connH = document.createElement('div');
            connH.className = 'ct-conn-h';
            slot.appendChild(connH);
        }

        // ── Group: slot + children column ──
        const group = document.createElement('div');
        group.className = 'ct-node-group';
        group.appendChild(slot);

        if (children.length > 0) {
            const childrenCol = document.createElement('div');
            childrenCol.className = 'ct-children-col';

            children.forEach((child, i) => {
                const childGroup = document.createElement('div');
                childGroup.style.display = 'flex';
                childGroup.style.flexDirection = 'row';
                childGroup.style.alignItems = 'center';

                const legH = document.createElement('div');
                legH.className = 'ct-conn-branch';
                childGroup.appendChild(legH);

                const childNode = this._renderCareerNode(child);
                childGroup.appendChild(childNode);
                childrenCol.appendChild(childGroup);

                // Vertical connector between siblings (not after last)
                if (i < children.length - 1) {
                    const vLine = document.createElement('div');
                    vLine.className = 'ct-conn-v';
                    vLine.style.height = '8px';  // reduzido de 16px → 8px
                    vLine.style.marginLeft = '0';
                    vLine.style.width = '2px';
                    childrenCol.appendChild(vLine);
                }
            });

            group.appendChild(childrenCol);
        }

        return group;
    }

    _renderCareerDetailPanel(emp, branchColor) {
        const panel = this.elements.ctDetailPanel;
        const branchDef = BRANCHES[emp.branch] || { color: '#999', label: emp.branch };
        const color = branchColor || branchDef.color;

        const salaryHtml = emp.salary > 0
            ? `💸 $${emp.salary}/turno`
            : 'Gratuito';

        const prevReqs = (emp.promotesFrom || []).map(id => {
            const e = EMPLOYEES[id];
            return e ? `<div class="ct-detail-chip" style="border-left-color:${color}">${e.name}</div>` : '';
        }).join('');

        const nextCards = (emp.promotesTo || []).map(id => {
            const e = EMPLOYEES[id];
            if (!e) return '';
            const c = (BRANCHES[e.branch] || {}).color || '#999';
            return `<div class="ct-detail-chip" style="border-left-color:${c}">${e.name}</div>`;
        }).join('');

        panel.innerHTML = `
            <div class="ct-detail-name" style="color:${color}">${emp.name}</div>
            <div class="ct-detail-salary">${salaryHtml}${emp.is1x ? ' &nbsp;·&nbsp; <strong>1× Único</strong>' : ''}</div>

            <div class="ct-detail-section-title">Ação</div>
            <p class="ct-detail-action">${emp.action?.description || '—'}</p>

            <div class="ct-detail-section-title">Pré-requisito</div>
            <div class="ct-detail-chip-list">
                ${prevReqs || '<span class="ct-detail-none">Nenhum (entrada)</span>'}
            </div>

            <div class="ct-detail-section-title">Pode evoluir para</div>
            <div class="ct-detail-chip-list">
                ${nextCards || '<span class="ct-detail-none">Nenhum (máximo)</span>'}
            </div>
        `;
    }

    _clearCareerDetailPanel() {
        const panel = this.elements.ctDetailPanel;
        if (!panel) return;
        panel.innerHTML = `
            <div class="ct-detail-empty">
                <span class="ct-detail-empty-icon">🗂️</span>
                <p>Selecione um funcionário para ver os detalhes</p>
            </div>
        `;
    }

    _renderCareerLegend() {
        const legend = this.elements.ctLegend;
        if (!legend || typeof BRANCHES === 'undefined') return;
        legend.innerHTML = '';

        for (const [, def] of Object.entries(BRANCHES)) {
            const item = document.createElement('div');
            item.className = 'ct-legend-item';
            item.innerHTML = `
                <span class="ct-legend-swatch" style="background:${def.color}"></span>
                <span>${def.label}</span>
            `;
            legend.appendChild(item);
        }
    }

    hideCareerTreeModal() {
        this.elements.careerTreeOverlay.classList.add('hidden');
    }

    // ═══════════════════════════════════════════
    // MILESTONES (sidebar badges)
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
