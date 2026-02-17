// Food Chain Magnate - Controller: GameController
// Orchestrates Model (GameState) ↔ View (GameView)
// Handles user interactions and phase-specific flows

class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this._selectedBeachEmployee = null;

        this._initialize();
    }

    _initialize() {
        this._renderAll();
        this._attachEventListeners();
        this._attachModelListeners();

        setTimeout(() => {
            const player = this.model.getActivePlayer();
            this.view.showNotification(
                `Welcome to Food Chain Magnate! ${player.name}'s turn. Phase: Restructuring`,
                'info'
            );
        }, 300);
    }

    // ═══════════════════════════════════════════
    // FULL RENDER
    // ═══════════════════════════════════════════

    _renderAll() {
        const player = this.model.getActivePlayer();
        if (!player) return;

        // Header
        this.view.updateHeader(
            this.model.getPhase(),
            this.model.getTurn(),
            player.name
        );

        // Bank
        this.view.updateBank(this.model.getBank());

        // Phase bar
        this.view.updatePhaseBar(this.model.getPhase(), this.model.PHASES);

        // Dashboard
        this.view.updateDashboard(player);

        // Org chart
        this.view.renderOrgChart(
            player.orgChart,
            (node) => this._onOrgNodeClick(node),
            (parentNodeId) => this._onSlotClick(parentNodeId)
        );

        // Beach
        this.view.renderBeach(
            player.orgChart.getAtBeach(),
            (entry) => this._onBeachClick(entry)
        );

        // Map (placeholder)
        this.view.renderMap((row, col) => this._onCellClick(row, col));

        // Update button text based on phase
        this._updateActionButton();
    }

    _updateActionButton() {
        const phase = this.model.getPhase();
        const btn = this.view.elements.endTurnBtn;

        const labels = {
            restructuring: 'Done Restructuring',
            order_of_business: 'Continue',
            working: 'Done Working',
            dinnertime: 'End Dinner',
            payday: 'Pay & Continue',
            marketing_campaigns: 'End Marketing',
            cleanup: 'Next Turn',
        };

        btn.textContent = labels[phase] || 'Next Phase';
    }

    // ═══════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════

    _attachEventListeners() {
        // End phase / advance
        this.view.elements.endTurnBtn.addEventListener('click', () => {
            this._onEndPhase();
        });

        // Close modals
        document.getElementById('close-shop-btn').addEventListener('click', () => {
            this.view.hideHiringModal();
        });
        document.getElementById('close-training-btn').addEventListener('click', () => {
            this.view.hideTrainingModal();
            this._selectedBeachEmployee = null;
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'h' || e.key === 'H') {
                this._openHiringModal();
            } else if (e.key === 'Escape') {
                this.view.hideHiringModal();
                this.view.hideTrainingModal();
                this._selectedBeachEmployee = null;
            } else if (e.key === 'Enter') {
                this._onEndPhase();
            }
        });
    }

    _attachModelListeners() {
        this.model.onChange((eventType, data) => {
            switch (eventType) {
                case 'employee_hired':
                    this.view.showNotification(`Hired ${data.employeeId}!`, 'success');
                    this._renderAll();
                    break;

                case 'employee_trained':
                    this.view.showNotification(`Trained → ${data.targetId}!`, 'success');
                    this._renderAll();
                    break;

                case 'employee_assigned':
                    this._renderAll();
                    break;

                case 'employee_unassigned':
                    this._renderAll();
                    break;

                case 'milestone_claimed':
                    this.view.showNotification(`🏆 Milestone: ${data.milestoneId}!`, 'info');
                    break;

                case 'phase_changed':
                    this._renderAll();
                    break;

                case 'player_changed':
                    this._renderAll();
                    break;

                case 'payday':
                    this.view.showNotification(
                        `Payday: -$${data.totalSalary} salary. Remaining: $${data.remaining}`,
                        data.remaining >= 0 ? 'success' : 'error'
                    );
                    break;

                case 'sale_completed':
                    this.view.showNotification(
                        `💰 Sale: +$${data.totalRevenue}!`,
                        'success'
                    );
                    this._renderAll();
                    break;

                case 'game_over':
                    const winner = this.model.getPlayer(data.winner);
                    this.view.showNotification(
                        `🎉 Game Over! ${winner?.name || 'Unknown'} wins!`,
                        'info'
                    );
                    break;

                case 'player_eliminated':
                    const eliminated = this.model.getPlayer(data.playerId);
                    this.view.showNotification(
                        `💀 ${eliminated?.name || 'Player'} went bankrupt!`,
                        'error'
                    );
                    break;
            }
        });
    }

    // ═══════════════════════════════════════════
    // PHASE TRANSITIONS
    // ═══════════════════════════════════════════

    _onEndPhase() {
        const phase = this.model.getPhase();

        switch (phase) {
            case 'payday':
                // Auto-pay before advancing
                const player = this.model.getActivePlayer();
                if (player) {
                    this.model.payDay(player.id);
                }
                break;
        }

        // Try advancing to next player first, then next phase
        this.model.nextPlayer();
        this._renderAll();

        const newPhase = this.model.getPhase();
        if (newPhase !== phase) {
            this.view.showNotification(`Phase: ${newPhase}`, 'info');
        }
    }

    // ═══════════════════════════════════════════
    // ORG CHART INTERACTIONS
    // ═══════════════════════════════════════════

    _onOrgNodeClick(node) {
        const phase = this.model.getPhase();

        if (phase === 'restructuring' && node.nodeId !== 0) {
            // Send back to beach
            const player = this.model.getActivePlayer();
            if (player) {
                const result = this.model.unassignEmployee(player.id, node.nodeId);
                if (result.success) {
                    this.view.showNotification('Sent to beach', 'info');
                }
            }
        }
    }

    _onSlotClick(parentNodeId) {
        const phase = this.model.getPhase();
        if (phase !== 'restructuring') {
            this.view.showNotification('Assign employees during Restructuring phase', 'error');
            return;
        }

        const player = this.model.getActivePlayer();
        if (!player) return;

        const beach = player.orgChart.getAtBeach();
        if (beach.length === 0) {
            this.view.showNotification('No employees on the beach to assign', 'error');
            return;
        }

        // If only one beach employee, assign directly
        if (beach.length === 1) {
            const result = this.model.assignEmployee(player.id, beach[0].instanceId, parentNodeId);
            if (result.success) {
                this.view.showNotification('Assigned!', 'success');
            } else {
                this.view.showNotification(`Can't assign: ${result.reason}`, 'error');
            }
            return;
        }

        // Multiple — show beach as selection (click beach employee to assign to this slot)
        this.view.showNotification('Click a beach employee to assign to this slot', 'info');
        this._pendingSlotAssignment = parentNodeId;
    }

    _onBeachClick(entry) {
        const phase = this.model.getPhase();
        const player = this.model.getActivePlayer();
        if (!player) return;

        // If we have a pending slot assignment
        if (this._pendingSlotAssignment !== undefined) {
            const result = this.model.assignEmployee(
                player.id,
                entry.instanceId,
                this._pendingSlotAssignment
            );
            if (result.success) {
                this.view.showNotification('Assigned!', 'success');
            } else {
                this.view.showNotification(`Can't assign: ${result.reason}`, 'error');
            }
            this._pendingSlotAssignment = undefined;
            return;
        }

        // During Working — clicking beach employee opens training modal
        if (phase === 'working') {
            this._openTrainingModal(entry);
        }
    }

    // ═══════════════════════════════════════════
    // HIRING
    // ═══════════════════════════════════════════

    _openHiringModal() {
        const hireable = this.model.getHireableEmployees().map(e => ({
            ...e,
            currentSupply: this.model.getSupply(e.id),
        }));

        this.view.showHiringModal(hireable, (emp) => this._onHire(emp));
    }

    _onHire(emp) {
        const player = this.model.getActivePlayer();
        if (!player) return;

        const result = this.model.hireEmployee(player.id, emp.id);
        if (result.success) {
            // Refresh modal with updated supply
            this._openHiringModal();
        } else {
            this.view.showNotification(`Can't hire: ${result.reason}`, 'error');
        }
    }

    // ═══════════════════════════════════════════
    // TRAINING
    // ═══════════════════════════════════════════

    _openTrainingModal(beachEntry) {
        const validPromotions = typeof getValidPromotions !== 'undefined'
            ? getValidPromotions(beachEntry.employeeId)
            : [];

        if (validPromotions.length === 0) {
            this.view.showNotification('This employee cannot be trained further', 'error');
            return;
        }

        this._selectedBeachEmployee = beachEntry;
        this.view.showTrainingModal(beachEntry, validPromotions, (entry, targetId) => {
            this._onTrain(entry, targetId);
        });
    }

    _onTrain(beachEntry, targetId) {
        const player = this.model.getActivePlayer();
        if (!player) return;

        const result = this.model.trainEmployee(player.id, beachEntry.instanceId, targetId);
        if (result.success) {
            this.view.hideTrainingModal();
            this._selectedBeachEmployee = null;
        } else {
            this.view.showNotification(`Can't train: ${result.reason}`, 'error');
        }
    }

    // ═══════════════════════════════════════════
    // MAP
    // ═══════════════════════════════════════════

    _onCellClick(row, col) {
        // Placeholder — will be implemented with MapState
        this.view.showNotification(`Cell [${row},${col}] — Map coming soon!`, 'info');
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameController;
}
