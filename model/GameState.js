// Food Chain Magnate - Model: GameState
// Core game state machine — 7-phase turn structure, player management, action validation
// Designed to run in both browser (sandbox) and Node.js (server) with zero changes

class GameState {
    /**
     * @param {object} config
     * @param {number} config.playerCount - 2-5 players
     * @param {string[]} config.playerNames - Array of player names
     * @param {boolean} config.beginnerMode - If true: no Bank Reserve, bank = $75/player
     */
    constructor(config = {}) {
        const playerCount = config.playerCount || 2;
        const playerNames = config.playerNames || [];
        const beginnerMode = config.beginnerMode ?? true;

        // Turn phases in order (from RULES.md)
        this.PHASES = [
            'restructuring',
            'order_of_business',
            'working',
            'dinnertime',
            'payday',
            'marketing_campaigns',
            'cleanup',
        ];

        // State
        this.state = {
            turn: 1,
            phase: 'restructuring',
            phaseIndex: 0,

            // Turn order (player IDs in action order for this turn)
            turnOrder: [],
            activePlayerIndex: 0,      // index into turnOrder
            playerCount: playerCount,

            // Players
            players: {},

            // Bank
            bank: beginnerMode ? 75 * playerCount : 50 * playerCount,
            bankDepleted: 0,   // 0 = normal, 1 = first depletion (reserve added), 2 = game over
            beginnerMode: beginnerMode,

            // Bank Reserve Cards (not yet implemented in detail)
            bankReserveCards: [],
            bankReserveRevealed: false,

            // Supply piles (track remaining cards per employee type)
            supply: {},

            // Milestones
            milestones: {},

            // Marketing pieces available (shared pool)
            marketingPieces: {
                billboard: 6,
                mailbox: 4,
                airplane: 3,
                radio: 3,
            },

            // Global state
            gameOver: false,
            winner: null,

            // Tracking for current turn
            currentTurnHires: {},     // playerId → count of hires this turn
            currentTurnRecruit$5: {}, // playerId → count of -$5 discounts used
        };

        // Initialize supply from EmployeeData
        this._initializeSupply();

        // Initialize players
        for (let i = 1; i <= playerCount; i++) {
            const name = playerNames[i - 1] || `Player ${i}`;
            this.state.players[i] = this._createPlayer(i, name);
        }

        // Initial turn order (random shuffle)
        this.state.turnOrder = this._shuffleArray(
            Array.from({ length: playerCount }, (_, i) => i + 1)
        );

        // Initialize milestones (all unclaimed)
        this._initializeMilestones();

        // Event system
        this._listeners = [];
    }

    // ═══════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════

    _createPlayer(id, name) {
        return {
            id,
            name,
            money: 0,                          // Players start with $0
            orgChart: new OrgChart(3),          // CEO with 3 slots (may change with Bank Reserve)
            inventory: {
                burger: 0,
                pizza: 0,
                beer: 0,
                coke: 0,
                lemonade: 0,
            },
            restaurants: 3,                     // Restaurants available to place (start with 3)
            restaurantsPlaced: [],              // Array of placed restaurant positions
            freezerCapacity: 0,                 // 0 = no freezer, 10 = has freezer milestone
            unitPrice: 10,                      // Base price, modified by pricing employees & milestones
            permanentPriceModifier: 0,          // From "First to Lower Prices" milestone
            eliminated: false,                  // Bankruptcy
            recruitingDiscountsThisTurn: 0,     // -$5 per use
            milestonesOwned: [],                // Array of milestone IDs
            hasCFOMilestone: false,             // "First to Have $100" — CEO acts as CFO
            canTrainCFO: true,                  // False after $100 milestone
            multiTrainerAllowed: false,         // "First to Pay $20+ Salaries" milestone
            bonusBurger: 0,                     // +$5 per burger sold (milestone)
            bonusPizza: 0,                      // +$5 per pizza sold
            bonusDrink: 0,                      // +$5 per drink sold
            eternalCampaigns: false,            // "First Billboard" milestone
            noMarketingSalary: false,           // "First Billboard" — no salary for marketing chain
            radioDoubleTokens: false,           // "First Radio" milestone
            extraOrderSlots: 0,                 // +2 from "First Airplane" milestone
            waitressBonus: 0,                   // +$2 per waitress from "First Waitress" milestone
            errandBoyBonus: false,              // "First Errand Boy" milestone
            cartOperatorRangeBonus: false,      // "First Cart Operator" milestone
            canSeeBankReserve: false,           // "First $20" milestone
            salaryDiscount: 0,                  // $15 from "First to Train" milestone
        };
    }

    _initializeSupply() {
        const supply = {};
        if (typeof EMPLOYEES !== 'undefined') {
            for (const [id, emp] of Object.entries(EMPLOYEES)) {
                supply[id] = emp.pileSize;
            }
        }
        this.state.supply = supply;
    }

    _initializeMilestones() {
        const ids = [
            'first_train', 'first_hire_3', 'first_pay_20_salary',
            'first_waitress', 'first_20_cash', 'first_100_cash',
            'first_errand_boy', 'first_cart_operator',
            'first_burger_produced', 'first_pizza_produced',
            'first_throw_away', 'first_lower_prices',
            'first_burger_marketed', 'first_pizza_marketed', 'first_drink_marketed',
            'first_billboard', 'first_airplane', 'first_radio',
        ];
        const milestones = {};
        for (const id of ids) {
            milestones[id] = { claimed: false, claimedBy: [] };
        }
        this.state.milestones = milestones;
    }

    // ═══════════════════════════════════════════
    // OBSERVER PATTERN
    // ═══════════════════════════════════════════

    onChange(callback) {
        this._listeners.push(callback);
    }

    _notify(eventType, data = {}) {
        for (const cb of this._listeners) {
            cb(eventType, { ...data, phase: this.state.phase, turn: this.state.turn });
        }
    }

    // ═══════════════════════════════════════════
    // QUERIES
    // ═══════════════════════════════════════════

    getPhase() { return this.state.phase; }
    getTurn() { return this.state.turn; }
    getBank() { return this.state.bank; }
    isGameOver() { return this.state.gameOver; }
    getTurnOrder() { return [...this.state.turnOrder]; }

    getActivePlayer() {
        const id = this.state.turnOrder[this.state.activePlayerIndex];
        return this.state.players[id] || null;
    }

    getActivePlayerId() {
        return this.state.turnOrder[this.state.activePlayerIndex];
    }

    getPlayer(playerId) {
        return this.state.players[playerId] || null;
    }

    getAllPlayers() {
        return Object.values(this.state.players);
    }

    getAlivePlayers() {
        return this.getAllPlayers().filter(p => !p.eliminated);
    }

    getSupply(employeeId) {
        return this.state.supply[employeeId] ?? 0;
    }

    getMilestone(milestoneId) {
        return this.state.milestones[milestoneId] || null;
    }

    isMilestoneClaimed(milestoneId) {
        const m = this.state.milestones[milestoneId];
        return m ? m.claimed : false;
    }

    /**
     * Get entry-level employees available for hiring (with supply > 0)
     */
    getHireableEmployees() {
        if (typeof getEntryLevelEmployees === 'undefined') return [];
        return getEntryLevelEmployees().filter(e => this.getSupply(e.id) > 0);
    }

    /**
     * Calculate effective unit price for a player this turn
     */
    getEffectiveUnitPrice(playerId) {
        const player = this.getPlayer(playerId);
        if (!player) return 10;

        let price = 10; // base price

        // Permanent price modifier (milestone)
        price += player.permanentPriceModifier;

        // Active pricing employees in org chart
        const atWork = player.orgChart.getAtWork();
        for (const node of atWork) {
            const emp = typeof getEmployee !== 'undefined' ? getEmployee(node.employeeId) : null;
            if (emp && emp.action && emp.action.type === 'price') {
                price += emp.action.priceModifier;
            }
        }

        player.unitPrice = price;
        return price;
    }

    /**
     * Count active waitresses for a player
     */
    countActiveWaitresses(playerId) {
        const player = this.getPlayer(playerId);
        if (!player) return 0;
        return player.orgChart.countAtWorkByType('waitress');
    }

    // ═══════════════════════════════════════════
    // PHASE MACHINE
    // ═══════════════════════════════════════════

    /**
     * Advance to next phase (called when all players complete current phase)
     */
    nextPhase() {
        if (this.state.gameOver) return null;

        this.state.phaseIndex++;

        if (this.state.phaseIndex >= this.PHASES.length) {
            // New turn
            this.state.phaseIndex = 0;
            this.state.turn++;
            this._resetTurnTracking();
        }

        this.state.phase = this.PHASES[this.state.phaseIndex];
        this.state.activePlayerIndex = 0;

        // Phase-specific setup
        switch (this.state.phase) {
            case 'order_of_business':
                this._resolveOrderOfBusiness();
                break;
            case 'working':
                this._resetWorkingPhaseTracking();
                break;
            case 'payday':
                // Payday is handled per-player via payDay()
                break;
            case 'cleanup':
                this._runCleanup();
                break;
        }

        this._notify('phase_changed', { phase: this.state.phase });
        return this.state.phase;
    }

    /**
     * Advance to next player within current phase
     */
    nextPlayer() {
        this.state.activePlayerIndex++;

        // Skip eliminated players
        while (
            this.state.activePlayerIndex < this.state.turnOrder.length &&
            this.getActivePlayer()?.eliminated
        ) {
            this.state.activePlayerIndex++;
        }

        if (this.state.activePlayerIndex >= this.state.turnOrder.length) {
            // All players done — auto-advance phase
            return this.nextPhase();
        }

        this._notify('player_changed', {
            playerId: this.getActivePlayerId(),
        });
        return this.state.phase;
    }

    _resetTurnTracking() {
        this.state.currentTurnHires = {};
        this.state.currentTurnRecruit$5 = {};
        for (const player of this.getAllPlayers()) {
            player.recruitingDiscountsThisTurn = 0;
        }
    }

    _resetWorkingPhaseTracking() {
        // Reset per-turn tracking before Working 9-5
        for (const player of this.getAllPlayers()) {
            player.recruitingDiscountsThisTurn = 0;
            this.state.currentTurnHires[player.id] = 0;
        }
    }

    // ═══════════════════════════════════════════
    // PHASE: ORDER OF BUSINESS
    // ═══════════════════════════════════════════

    _resolveOrderOfBusiness() {
        // Player with most open slots chooses first
        // Tiebreak: earlier in previous turn order
        const players = this.getAlivePlayers();
        const previousOrder = [...this.state.turnOrder];

        const scored = players.map(p => {
            const openSlots = p.orgChart.getTotalOpenSlots() + p.extraOrderSlots;
            const previousPosition = previousOrder.indexOf(p.id);
            return { id: p.id, openSlots, previousPosition };
        });

        // Sort: most open slots first, then earlier in previous order
        scored.sort((a, b) => {
            if (b.openSlots !== a.openSlots) return b.openSlots - a.openSlots;
            return a.previousPosition - b.previousPosition;
        });

        this.state.turnOrder = scored.map(s => s.id);
        this._notify('turn_order_resolved', { turnOrder: this.state.turnOrder });
    }

    // ═══════════════════════════════════════════
    // ACTIONS: HIRING (Working 9-5 — Recruit step)
    // ═══════════════════════════════════════════

    /**
     * Hire an entry-level employee
     * @param {number} playerId
     * @param {string} employeeId - Entry-level employee type ID
     * @returns {{ success: boolean, reason?: string }}
     */
    hireEmployee(playerId, employeeId) {
        const player = this.getPlayer(playerId);
        if (!player || player.eliminated) return { success: false, reason: 'invalid_player' };

        // Validate entry-level
        const emp = typeof getEmployee !== 'undefined' ? getEmployee(employeeId) : null;
        if (!emp || !emp.isEntryLevel) return { success: false, reason: 'not_entry_level' };

        // Check supply
        if (this.getSupply(employeeId) <= 0) return { success: false, reason: 'out_of_supply' };

        // Deduct from supply
        this.state.supply[employeeId]--;

        // Add to beach
        const hired = player.orgChart.hireToBeach(employeeId);

        // Track hires this turn
        if (!this.state.currentTurnHires[playerId]) this.state.currentTurnHires[playerId] = 0;
        this.state.currentTurnHires[playerId]++;

        // Check milestone: "First to Hire 3 in 1 Turn"
        if (this.state.currentTurnHires[playerId] >= 3) {
            this._tryClaimMilestone('first_hire_3', playerId);
        }

        this._notify('employee_hired', { playerId, employeeId, instanceId: hired.instanceId });
        return { success: true, instanceId: hired.instanceId };
    }

    /**
     * Use recruiting effect as -$5 salary discount instead of hiring
     */
    useRecruitingDiscount(playerId) {
        const player = this.getPlayer(playerId);
        if (!player) return { success: false, reason: 'invalid_player' };

        player.recruitingDiscountsThisTurn++;
        this._notify('recruiting_discount_used', { playerId, total: player.recruitingDiscountsThisTurn });
        return { success: true };
    }

    // ═══════════════════════════════════════════
    // ACTIONS: TRAINING (Working 9-5 — Train step)
    // ═══════════════════════════════════════════

    /**
     * Train a beach employee one level up
     * @param {number} playerId
     * @param {string} instanceId - Instance to train
     * @param {string} targetId - Target employee type
     * @param {boolean} ignoreSupply - Coach/Guru can ignore empty supply
     */
    trainEmployee(playerId, instanceId, targetId, ignoreSupply = false) {
        const player = this.getPlayer(playerId);
        if (!player || player.eliminated) return { success: false, reason: 'invalid_player' };

        // Check supply (unless Coach/Guru ignores it)
        if (!ignoreSupply && this.getSupply(targetId) <= 0) {
            return { success: false, reason: 'out_of_supply' };
        }

        // Validate with OrgChart (checks beach + valid promotion)
        const result = player.orgChart.trainEmployee(instanceId, targetId);
        if (!result.success) return result;

        // Deduct from supply (if not ignoring)
        if (this.getSupply(targetId) > 0) {
            this.state.supply[targetId]--;
        }

        // Return old card to supply
        // (the old employee type card goes back — handled by OrgChart internally)

        // Check milestone: "First to Train"
        this._tryClaimMilestone('first_train', playerId);

        this._notify('employee_trained', { playerId, instanceId, targetId, newInstanceId: result.newInstanceId });
        return { success: true, newInstanceId: result.newInstanceId };
    }

    // ═══════════════════════════════════════════
    // ACTIONS: PRODUCE FOOD (Working 9-5)
    // ═══════════════════════════════════════════

    /**
     * Produce food items
     * @param {number} playerId
     * @param {string} foodType - 'burger' or 'pizza'
     * @param {number} quantity
     */
    produceFood(playerId, foodType, quantity) {
        const player = this.getPlayer(playerId);
        if (!player) return { success: false, reason: 'invalid_player' };
        if (player.inventory[foodType] === undefined) return { success: false, reason: 'invalid_food' };

        player.inventory[foodType] += quantity;

        // Check milestones
        if (foodType === 'burger' && !this.isMilestoneClaimed('first_burger_produced')) {
            this._tryClaimMilestone('first_burger_produced', playerId);
        }
        if (foodType === 'pizza' && !this.isMilestoneClaimed('first_pizza_produced')) {
            this._tryClaimMilestone('first_pizza_produced', playerId);
        }

        this._notify('food_produced', { playerId, foodType, quantity });
        return { success: true };
    }

    /**
     * Collect drinks
     */
    collectDrink(playerId, drinkType, quantity) {
        const player = this.getPlayer(playerId);
        if (!player) return { success: false, reason: 'invalid_player' };
        if (player.inventory[drinkType] === undefined) return { success: false, reason: 'invalid_drink' };

        player.inventory[drinkType] += quantity;

        this._notify('drink_collected', { playerId, drinkType, quantity });
        return { success: true };
    }

    // ═══════════════════════════════════════════
    // PHASE: PAYDAY
    // ═══════════════════════════════════════════

    /**
     * Calculate and execute payday for a player
     * @param {number} playerId
     * @param {string[]} employeesToFire - Instance IDs to fire (optional)
     */
    payDay(playerId, employeesToFire = []) {
        const player = this.getPlayer(playerId);
        if (!player || player.eliminated) return { success: false, reason: 'invalid_player' };

        // Fire chosen employees first (returns them to supply)
        const fired = [];
        for (const instanceId of employeesToFire) {
            const result = player.orgChart.fireEmployee(instanceId);
            if (result.success) {
                fired.push(result.employeeId);
                // Return to supply
                if (this.state.supply[result.employeeId] !== undefined) {
                    this.state.supply[result.employeeId]++;
                }
                // Also return displaced employees
                if (result.displaced) {
                    for (const d of result.displaced) {
                        if (this.state.supply[d.employeeId] !== undefined) {
                            this.state.supply[d.employeeId]++;
                        }
                    }
                }
            }
        }

        // Calculate salary
        let totalSalary = 0;
        const allEmployees = player.orgChart.getAllEmployees();
        for (const emp of allEmployees) {
            if (emp.employeeId === 'ceo') continue; // CEO: no salary
            const empDef = typeof getEmployee !== 'undefined' ? getEmployee(emp.employeeId) : null;
            if (!empDef) continue;

            if (empDef.isEntryLevel) continue; // Entry-level: no salary

            // Check "First Billboard" — no salary for marketing chain
            if (player.noMarketingSalary &&
                ['campaign_manager', 'brand_manager', 'brand_director'].includes(emp.employeeId)) {
                continue;
            }

            totalSalary += empDef.salary;
        }

        // Apply discounts
        const recruitDiscount = player.recruitingDiscountsThisTurn * 5;
        const milestoneDiscount = player.salaryDiscount;
        totalSalary = Math.max(0, totalSalary - recruitDiscount - milestoneDiscount);

        // Check milestone: "First to Pay $20+ in Salaries"
        if (totalSalary >= 20) {
            this._tryClaimMilestone('first_pay_20_salary', playerId);
        }

        // Pay salary
        player.money -= totalSalary;

        // Check bankruptcy
        if (player.money < 0) {
            player.eliminated = true;
            this._notify('player_eliminated', { playerId, debt: player.money });
        }

        // Pay salary to bank
        this.state.bank += totalSalary;

        this._notify('payday', {
            playerId,
            totalSalary,
            recruitDiscount,
            milestoneDiscount,
            fired,
            remaining: player.money,
        });

        return { success: true, totalSalary, fired };
    }

    // ═══════════════════════════════════════════
    // PHASE: CLEANUP
    // ═══════════════════════════════════════════

    _runCleanup() {
        for (const player of this.getAlivePlayers()) {
            // Discard unsold food/drinks
            const totalItems =
                player.inventory.burger + player.inventory.pizza +
                player.inventory.beer + player.inventory.coke + player.inventory.lemonade;

            if (totalItems > 0 && player.freezerCapacity === 0) {
                // Check milestone: "First to Throw Away"
                this._tryClaimMilestone('first_throw_away', player.id);

                player.inventory.burger = 0;
                player.inventory.pizza = 0;
                player.inventory.beer = 0;
                player.inventory.coke = 0;
                player.inventory.lemonade = 0;
            } else if (totalItems > player.freezerCapacity && player.freezerCapacity > 0) {
                // Has freezer but too many items — keep up to capacity
                // For now, auto-keep highest-value items (simplification)
                // In full game, player chooses which to keep
                const kept = Math.min(totalItems, player.freezerCapacity);
                // Simple: keep proportionally (will be improved with UI)
                if (totalItems > kept) {
                    this._tryClaimMilestone('first_throw_away', player.id);
                }
            }
        }

        // Coming Soon restaurants → Welcome
        // (handled by MapState in future — placeholder)

        this._notify('cleanup_complete', { turn: this.state.turn });
    }

    // ═══════════════════════════════════════════
    // MILESTONES
    // ═══════════════════════════════════════════

    /**
     * Try to claim a milestone for a player
     * @param {string} milestoneId
     * @param {number} playerId
     */
    _tryClaimMilestone(milestoneId, playerId) {
        const milestone = this.state.milestones[milestoneId];
        if (!milestone || milestone.claimed) return false;

        milestone.claimed = true;
        milestone.claimedBy.push(playerId);

        const player = this.getPlayer(playerId);
        if (!player) return false;
        player.milestonesOwned.push(milestoneId);

        // Apply milestone effects
        this._applyMilestoneEffect(milestoneId, playerId);

        this._notify('milestone_claimed', { milestoneId, playerId });
        return true;
    }

    _applyMilestoneEffect(milestoneId, playerId) {
        const player = this.getPlayer(playerId);
        if (!player) return;

        switch (milestoneId) {
            case 'first_train':
                player.salaryDiscount = 15;
                break;

            case 'first_hire_3':
                // Give 2 Management Trainees for free
                for (let i = 0; i < 2; i++) {
                    if (this.getSupply('management_trainee') > 0) {
                        this.state.supply.management_trainee--;
                        player.orgChart.hireToBeach('management_trainee');
                    }
                }
                break;

            case 'first_pay_20_salary':
                player.multiTrainerAllowed = true;
                break;

            case 'first_waitress':
                player.waitressBonus = 2; // +$2 per active waitress
                break;

            case 'first_20_cash':
                player.canSeeBankReserve = true;
                break;

            case 'first_100_cash':
                player.hasCFOMilestone = true;
                player.canTrainCFO = false;
                // Must fire existing CFO if any
                const allEmps = player.orgChart.getAllEmployees();
                for (const emp of allEmps) {
                    if (emp.employeeId === 'cfo') {
                        player.orgChart.fireEmployee(emp.instanceId);
                        if (this.state.supply.cfo !== undefined) {
                            this.state.supply.cfo++;
                        }
                        break;
                    }
                }
                break;

            case 'first_errand_boy':
                player.errandBoyBonus = true;
                break;

            case 'first_cart_operator':
                player.cartOperatorRangeBonus = true;
                break;

            case 'first_burger_produced':
                // Give 1 Burger Cook for free
                if (this.getSupply('burger_cook') > 0) {
                    this.state.supply.burger_cook--;
                    player.orgChart.hireToBeach('burger_cook');
                }
                break;

            case 'first_pizza_produced':
                // Give 1 Pizza Cook for free
                if (this.getSupply('pizza_cook') > 0) {
                    this.state.supply.pizza_cook--;
                    player.orgChart.hireToBeach('pizza_cook');
                }
                break;

            case 'first_throw_away':
                player.freezerCapacity = 10;
                break;

            case 'first_lower_prices':
                player.permanentPriceModifier -= 1;
                break;

            case 'first_burger_marketed':
                player.bonusBurger = 5;
                break;

            case 'first_pizza_marketed':
                player.bonusPizza = 5;
                break;

            case 'first_drink_marketed':
                player.bonusDrink = 5;
                break;

            case 'first_billboard':
                player.eternalCampaigns = true;
                player.noMarketingSalary = true;
                break;

            case 'first_airplane':
                player.extraOrderSlots = 2;
                break;

            case 'first_radio':
                player.radioDoubleTokens = true;
                break;
        }
    }

    // ═══════════════════════════════════════════
    // DINNERTIME HELPERS
    // ═══════════════════════════════════════════

    /**
     * Process a sale from a restaurant to a house
     * @param {number} playerId - Restaurant owner
     * @param {object} items - { burger: n, pizza: n, beer: n, coke: n, lemonade: n }
     * @param {boolean} isGarden - If house has garden (2x price)
     * @returns {{ success: boolean, revenue?: number }}
     */
    processSale(playerId, items, isGarden = false) {
        const player = this.getPlayer(playerId);
        if (!player) return { success: false, reason: 'invalid_player' };

        const unitPrice = this.getEffectiveUnitPrice(playerId);
        let totalItems = 0;
        let baseRevenue = 0;
        let itemCounts = { burger: 0, pizza: 0, beer: 0, coke: 0, lemonade: 0 };

        // Verify player has the items
        for (const [type, qty] of Object.entries(items)) {
            if (qty <= 0) continue;
            if ((player.inventory[type] || 0) < qty) {
                return { success: false, reason: `insufficient_${type}` };
            }
            totalItems += qty;
            itemCounts[type] = qty;
        }

        if (totalItems === 0) return { success: false, reason: 'no_items' };

        // Calculate revenue
        const priceMult = isGarden ? 2 : 1;
        baseRevenue = totalItems * unitPrice * priceMult;

        // Add per-item bonuses (milestones)
        let bonusRevenue = 0;
        bonusRevenue += itemCounts.burger * player.bonusBurger;
        bonusRevenue += itemCounts.pizza * player.bonusPizza;
        bonusRevenue += (itemCounts.beer + itemCounts.coke + itemCounts.lemonade) * player.bonusDrink;

        let totalRevenue = baseRevenue + bonusRevenue;

        // Waitress bonus
        const activeWaitresses = this.countActiveWaitresses(playerId);
        const waitressIncome = activeWaitresses * (3 + player.waitressBonus);

        totalRevenue += waitressIncome;

        // CFO bonus (50% rounded down) — applies to total including waitress
        let cfoBonus = 0;
        const hasCFO = player.hasCFOMilestone ||
            player.orgChart.countAtWorkByType('cfo') > 0;
        if (hasCFO) {
            cfoBonus = Math.floor(totalRevenue * 0.5);
            totalRevenue += cfoBonus;
        }

        // Deduct items from inventory
        for (const [type, qty] of Object.entries(items)) {
            if (qty > 0) player.inventory[type] -= qty;
        }

        // Pay from bank
        const actualPayment = Math.min(totalRevenue, this.state.bank);
        player.money += actualPayment;
        this.state.bank -= actualPayment;

        // Check bank depletion
        if (this.state.bank <= 0) {
            this._handleBankDepletion();
        }

        // Check milestone: "First to Have $20/$100"
        if (player.money >= 20) {
            this._tryClaimMilestone('first_20_cash', playerId);
        }
        if (player.money >= 100) {
            this._tryClaimMilestone('first_100_cash', playerId);
        }

        this._notify('sale_completed', {
            playerId,
            items: itemCounts,
            baseRevenue,
            bonusRevenue,
            waitressIncome,
            cfoBonus,
            totalRevenue: actualPayment,
            isGarden,
        });

        return { success: true, revenue: actualPayment };
    }

    _handleBankDepletion() {
        this.state.bankDepleted++;

        if (this.state.bankDepleted === 1) {
            // First depletion: reveal Bank Reserve cards
            if (!this.state.beginnerMode) {
                // Add Bank Reserve values to bank (simplified — needs actual card values)
                // For now, add a reasonable amount
                const reserveTotal = this.state.playerCount * 15; // placeholder
                this.state.bank += reserveTotal;
                this.state.bankReserveRevealed = true;
            }
            this._notify('bank_first_depletion', { bank: this.state.bank });
        } else if (this.state.bankDepleted >= 2) {
            // Second depletion: game over (after completing current Dinnertime)
            this.state.gameOver = true;

            // Determine winner
            const alive = this.getAlivePlayers();
            alive.sort((a, b) => b.money - a.money);
            this.state.winner = alive[0]?.id || null;

            this._notify('game_over', { winner: this.state.winner });
        }
    }

    // ═══════════════════════════════════════════
    // RESTRUCTURING HELPERS
    // ═══════════════════════════════════════════

    /**
     * Assign a beach employee to the org chart
     */
    assignEmployee(playerId, instanceId, parentNodeId) {
        const player = this.getPlayer(playerId);
        if (!player) return { success: false, reason: 'invalid_player' };

        const result = player.orgChart.assignToTree(instanceId, parentNodeId);
        if (result.success) {
            this._notify('employee_assigned', { playerId, instanceId, parentNodeId, nodeId: result.nodeId });
        }
        return result;
    }

    /**
     * Send an employee back to beach
     */
    unassignEmployee(playerId, nodeId) {
        const player = this.getPlayer(playerId);
        if (!player) return { success: false, reason: 'invalid_player' };

        const result = player.orgChart.sendToBeach(nodeId);
        if (result.success) {
            this._notify('employee_unassigned', { playerId, nodeId });
        }
        return result;
    }

    // ═══════════════════════════════════════════
    // SERIALIZATION
    // ═══════════════════════════════════════════

    toJSON() {
        const players = {};
        for (const [id, player] of Object.entries(this.state.players)) {
            players[id] = {
                ...player,
                orgChart: player.orgChart.toJSON(),
            };
        }
        return {
            ...this.state,
            players,
        };
    }

    static fromJSON(data) {
        const gs = new GameState({ playerCount: data.playerCount });
        gs.state = { ...data };
        gs.state.players = {};
        for (const [id, playerData] of Object.entries(data.players)) {
            gs.state.players[id] = {
                ...playerData,
                orgChart: OrgChart.fromJSON(playerData.orgChart),
            };
        }
        return gs;
    }

    // ═══════════════════════════════════════════
    // UTILITIES
    // ═══════════════════════════════════════════

    _shuffleArray(arr) {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameState;
}
