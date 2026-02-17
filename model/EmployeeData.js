// Food Chain Magnate - Employee Data Layer
// Career tree modeled as a DAG (Directed Acyclic Graph)
// All ~30 employee types with training paths, actions, and pile sizes

const BRANCHES = {
    management: { color: '#4A3728', label: 'Management', icon: '📋' },
    kitchen: { color: '#4CAF50', label: 'Kitchen', icon: '🍳' },
    marketing: { color: '#2196F3', label: 'Marketing', icon: '📢' },
    logistics: { color: '#8BC34A', label: 'Logistics', icon: '🚚' },
    pricing: { color: '#E91E63', label: 'Pricing', icon: '💲' },
    recruiting: { color: '#9E9E9E', label: 'Recruiting', icon: '🤝' },
    training: { color: '#9E9E9E', label: 'Training', icon: '🎓' },
    service: { color: '#9C27B0', label: 'Service', icon: '🍽️' },
    restaurant: { color: '#F44336', label: 'Restaurant Mgmt', icon: '🏪' },
    executive: { color: '#4A3728', label: 'Executive', icon: '👔' },
    finance: { color: '#9C27B0', label: 'Finance', icon: '💰' },
};

// Action types used by employees during Working 9-5
const ACTION_TYPES = {
    NONE: 'none',               // Management Trainees, entry-level managers
    RECRUIT: 'recruit',         // Recruiting Girl/Manager/HR: hire OR -$5
    TRAIN: 'train',             // Trainer/Coach/Guru
    PRODUCE: 'produce',         // Kitchen Trainee, Burger/Pizza Cook/Chef
    COLLECT_DRINKS: 'collect',  // Errand Boy, Cart Op, Truck, Zeppelin
    MARKET: 'market',           // Marketing Trainee → Brand Director
    PRICE: 'price',             // Pricing/Discount/Luxury Manager
    WAITRESS: 'waitress',       // Waitress: $3 + tiebreak
    CFO: 'cfo',                 // CFO: 50% bonus
    NEW_BUSINESS: 'nbd',        // New Business Developer: place house/garden
    LOCAL_MGR: 'local_mgr',     // Local Manager: place restaurant + drive-in
    REGIONAL_MGR: 'regional_mgr', // Regional Manager: move/place restaurant + drive-in
    SLOTS: 'slots',             // VP chain: provides subordinate slots
};

/**
 * Complete employee definitions.
 * promotesFrom/promotesTo: arrays of employee IDs forming the career DAG
 * is1x: only 1 copy per player allowed
 * salary: 0 for entry-level, 5 for trained (base game), 3 with milestone
 */
const EMPLOYEES = {
    // ═══════════════════════════════════════════
    // MANAGEMENT BRANCH (preta/marrom)
    // ═══════════════════════════════════════════
    management_trainee: {
        id: 'management_trainee',
        name: 'Management Trainee',
        branch: 'management',
        level: 0,
        isEntryLevel: true,
        salary: 0,
        pileSize: 18,
        is1x: false,
        promotesFrom: [],
        promotesTo: ['new_business_dev', 'luxury_manager', 'junior_vp'],
        maxSubordinates: 2,
        action: { type: ACTION_TYPES.SLOTS, description: 'Manages 2 subordinates' },
    },

    junior_vp: {
        id: 'junior_vp',
        name: 'Junior Vice President',
        branch: 'management',
        level: 1,
        isEntryLevel: false,
        salary: 5,
        pileSize: 6,
        is1x: false,
        promotesFrom: ['management_trainee'],
        promotesTo: ['local_manager', 'vice_president', 'discount_manager', 'recruiting_manager', 'coach'],
        maxSubordinates: 3,
        action: { type: ACTION_TYPES.SLOTS, description: 'Manages 3 subordinates' },
    },

    vice_president: {
        id: 'vice_president',
        name: 'Vice President',
        branch: 'management',
        level: 2,
        isEntryLevel: false,
        salary: 5,
        pileSize: 4,
        is1x: false,
        promotesFrom: ['junior_vp'],
        promotesTo: ['regional_manager', 'senior_vp', 'guru'],
        maxSubordinates: 4,
        action: { type: ACTION_TYPES.SLOTS, description: 'Manages 4 subordinates' },
    },

    senior_vp: {
        id: 'senior_vp',
        name: 'Senior Vice President',
        branch: 'executive',
        level: 3,
        isEntryLevel: false,
        salary: 5,
        pileSize: 3,
        is1x: false,
        promotesFrom: ['vice_president'],
        promotesTo: ['cfo', 'executive_vp', 'hr_director'],
        maxSubordinates: 5,
        action: { type: ACTION_TYPES.SLOTS, description: 'Manages 5 subordinates' },
    },

    executive_vp: {
        id: 'executive_vp',
        name: 'Executive Vice President',
        branch: 'executive',
        level: 4,
        isEntryLevel: false,
        salary: 5,
        pileSize: 2,
        is1x: true,
        promotesFrom: ['senior_vp'],
        promotesTo: [],
        maxSubordinates: 10,
        action: { type: ACTION_TYPES.SLOTS, description: 'Manages 10 subordinates' },
    },

    // ═══════════════════════════════════════════
    // MANAGEMENT BRANCH → SPECIAL PROMOTIONS
    // ═══════════════════════════════════════════
    new_business_dev: {
        id: 'new_business_dev',
        name: 'New Business Developer',
        branch: 'service',     // roxa
        level: 1,
        isEntryLevel: false,
        salary: 5,
        pileSize: 4,
        is1x: false,
        promotesFrom: ['management_trainee'],
        promotesTo: [],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.NEW_BUSINESS,
            description: 'Place 1 odd-numbered house OR 1 garden adjacent to road',
        },
    },

    luxury_manager: {
        id: 'luxury_manager',
        name: 'Luxury Manager',
        branch: 'pricing',    // rosa
        level: 1,
        isEntryLevel: false,
        salary: 5,
        pileSize: 2,
        is1x: true,
        promotesFrom: ['management_trainee'],
        promotesTo: [],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.PRICE,
            priceModifier: +10,
            mandatory: true,
            description: 'Increases unit price by $10 (mandatory)',
        },
    },

    local_manager: {
        id: 'local_manager',
        name: 'Local Manager',
        branch: 'restaurant',   // vermelha
        level: 2,
        isEntryLevel: false,
        salary: 5,
        pileSize: 4,
        is1x: false,
        promotesFrom: ['junior_vp'],
        promotesTo: [],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.LOCAL_MGR,
            driveIn: true,
            description: 'Place restaurant within 3 tiles (Coming Soon). Enables drive-in while active.',
        },
    },

    regional_manager: {
        id: 'regional_manager',
        name: 'Regional Manager',
        branch: 'restaurant',   // vermelha
        level: 3,
        isEntryLevel: false,
        salary: 5,
        pileSize: 2,
        is1x: true,
        promotesFrom: ['vice_president'],
        promotesTo: [],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.REGIONAL_MGR,
            driveIn: true,
            description: 'Place/move restaurant anywhere (opens immediately). Enables drive-in while active.',
        },
    },

    discount_manager: {
        id: 'discount_manager',
        name: 'Discount Manager',
        branch: 'pricing',    // rosa
        level: 2,
        isEntryLevel: false,
        salary: 5,
        pileSize: 4,
        is1x: false,
        promotesFrom: ['junior_vp'],
        promotesTo: [],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.PRICE,
            priceModifier: -3,
            mandatory: true,
            description: 'Reduces unit price by $3 (mandatory)',
        },
    },

    recruiting_manager: {
        id: 'recruiting_manager',
        name: 'Recruiting Manager',
        branch: 'recruiting',  // cinza
        level: 2,
        isEntryLevel: false,
        salary: 5,
        pileSize: 4,
        is1x: false,
        promotesFrom: ['junior_vp'],
        promotesTo: [],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.RECRUIT,
            uses: 2,
            mandatory: true,
            description: 'Uses recruiting effect 2 times (mandatory). Each: hire 1 entry-level OR -$5 salary discount.',
        },
    },

    coach: {
        id: 'coach',
        name: 'Coach',
        branch: 'training',   // cinza
        level: 2,
        isEntryLevel: false,
        salary: 5,
        pileSize: 4,
        is1x: false,
        promotesFrom: ['junior_vp'],
        promotesTo: [],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.TRAIN,
            levels: 2,
            ignoreEmpty: true,
            description: 'Trains 1 beach employee up to 2 levels. Ignores empty supply piles.',
        },
    },

    guru: {
        id: 'guru',
        name: 'Guru',
        branch: 'training',   // cinza
        level: 3,
        isEntryLevel: false,
        salary: 5,
        pileSize: 2,
        is1x: true,
        promotesFrom: ['vice_president'],
        promotesTo: [],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.TRAIN,
            levels: 3,
            ignoreEmpty: true,
            description: 'Trains 1 beach employee up to 3 levels. Ignores empty supply piles.',
        },
    },

    cfo: {
        id: 'cfo',
        name: 'CFO',
        branch: 'finance',    // roxa
        level: 4,
        isEntryLevel: false,
        salary: 5,
        pileSize: 2,
        is1x: true,
        promotesFrom: ['senior_vp'],
        promotesTo: [],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.CFO,
            mandatory: true,
            description: '50% bonus on all Dinnertime revenue (rounded down). Mandatory — affects bankruptcy.',
        },
    },

    hr_director: {
        id: 'hr_director',
        name: 'HR Director',
        branch: 'recruiting',  // cinza
        level: 4,
        isEntryLevel: false,
        salary: 5,
        pileSize: 2,
        is1x: true,
        promotesFrom: ['senior_vp'],
        promotesTo: [],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.RECRUIT,
            uses: 4,
            mandatory: true,
            description: 'Uses recruiting effect 4 times (mandatory).',
        },
    },

    // ═══════════════════════════════════════════
    // RECRUITING BRANCH (cinza) — standalone
    // ═══════════════════════════════════════════
    recruiting_girl: {
        id: 'recruiting_girl',
        name: 'Recruiting Girl',
        branch: 'recruiting',
        level: 0,
        isEntryLevel: true,
        salary: 0,
        pileSize: 12,
        is1x: false,
        promotesFrom: [],
        promotesTo: [],   // standalone, cannot be trained
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.RECRUIT,
            uses: 1,
            mandatory: false,
            description: 'Uses recruiting effect 1 time. Hire 1 entry-level OR -$5 salary discount.',
        },
    },

    // ═══════════════════════════════════════════
    // TRAINING BRANCH (cinza) — standalone
    // ═══════════════════════════════════════════
    trainer: {
        id: 'trainer',
        name: 'Trainer',
        branch: 'training',
        level: 0,
        isEntryLevel: true,
        salary: 0,
        pileSize: 12,
        is1x: false,
        promotesFrom: [],
        promotesTo: [],   // standalone
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.TRAIN,
            levels: 1,
            ignoreEmpty: false,
            description: 'Trains 1 beach employee 1 level up. Requires available card in supply.',
        },
    },

    // ═══════════════════════════════════════════
    // MARKETING BRANCH (azul)
    // ═══════════════════════════════════════════
    marketing_trainee: {
        id: 'marketing_trainee',
        name: 'Marketing Trainee',
        branch: 'marketing',
        level: 0,
        isEntryLevel: true,
        salary: 0,
        pileSize: 12,
        is1x: false,
        promotesFrom: [],
        promotesTo: ['campaign_manager'],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.MARKET,
            tileTypes: ['billboard'],
            duration: 'permanent',
            mandatory: true,
            description: 'Places 1 billboard (permanent). Mandatory.',
        },
    },

    campaign_manager: {
        id: 'campaign_manager',
        name: 'Campaign Manager',
        branch: 'marketing',
        level: 1,
        isEntryLevel: false,
        salary: 5,
        pileSize: 6,
        is1x: false,
        promotesFrom: ['marketing_trainee'],
        promotesTo: ['brand_manager'],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.MARKET,
            tileTypes: ['billboard', 'mailbox'],
            duration: 'timed',
            mandatory: true,
            description: 'Places 1 billboard or mailbox (timed). Mandatory. Marketeer linked to tile.',
        },
    },

    brand_manager: {
        id: 'brand_manager',
        name: 'Brand Manager',
        branch: 'marketing',
        level: 2,
        isEntryLevel: false,
        salary: 5,
        pileSize: 3,
        is1x: false,
        promotesFrom: ['campaign_manager'],
        promotesTo: ['brand_director'],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.MARKET,
            tileTypes: ['billboard', 'mailbox', 'airplane'],
            duration: 'timed',
            mandatory: true,
            description: 'Places billboard, mailbox, or airplane (timed). Mandatory.',
        },
    },

    brand_director: {
        id: 'brand_director',
        name: 'Brand Director',
        branch: 'marketing',
        level: 3,
        isEntryLevel: false,
        salary: 5,
        pileSize: 2,
        is1x: true,
        promotesFrom: ['brand_manager'],
        promotesTo: [],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.MARKET,
            tileTypes: ['billboard', 'mailbox', 'airplane', 'radio'],
            duration: 'timed',
            mandatory: true,
            description: 'Places any marketing tile type including radio (timed). Mandatory.',
        },
    },

    // ═══════════════════════════════════════════
    // LOGISTICS BRANCH (verde claro)
    // ═══════════════════════════════════════════
    errand_boy: {
        id: 'errand_boy',
        name: 'Errand Boy',
        branch: 'logistics',
        level: 0,
        isEntryLevel: true,
        salary: 0,
        pileSize: 12,
        is1x: false,
        promotesFrom: [],
        promotesTo: ['cart_operator'],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.COLLECT_DRINKS,
            quantityPerSource: 1,
            range: Infinity,     // doesn't need a source on the map
            movement: 'none',    // generates drink from thin air
            description: 'Produces 1 drink of any type (no source needed).',
        },
    },

    cart_operator: {
        id: 'cart_operator',
        name: 'Cart Operator',
        branch: 'logistics',
        level: 1,
        isEntryLevel: false,
        salary: 5,
        pileSize: 6,
        is1x: false,
        promotesFrom: ['errand_boy'],
        promotesTo: ['truck_driver'],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.COLLECT_DRINKS,
            quantityPerSource: 2,
            range: 2,
            movement: 'road',
            description: 'Collects 2 drinks per source within 2 tiles (by road).',
        },
    },

    truck_driver: {
        id: 'truck_driver',
        name: 'Truck Driver',
        branch: 'logistics',
        level: 2,
        isEntryLevel: false,
        salary: 5,
        pileSize: 3,
        is1x: false,
        promotesFrom: ['cart_operator'],
        promotesTo: ['zeppelin_pilot'],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.COLLECT_DRINKS,
            quantityPerSource: 3,
            range: 3,
            movement: 'road',
            description: 'Collects 3 drinks per source within 3 tiles (by road).',
        },
    },

    zeppelin_pilot: {
        id: 'zeppelin_pilot',
        name: 'Zeppelin Pilot',
        branch: 'logistics',
        level: 3,
        isEntryLevel: false,
        salary: 5,
        pileSize: 2,
        is1x: true,
        promotesFrom: ['truck_driver'],
        promotesTo: [],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.COLLECT_DRINKS,
            quantityPerSource: 2,
            range: 4,
            movement: 'fly',
            description: 'Collects 2 drinks per source within 4 tiles (flies — collects everything on tile).',
        },
    },

    // ═══════════════════════════════════════════
    // KITCHEN BRANCH (verde)
    // ═══════════════════════════════════════════
    kitchen_trainee: {
        id: 'kitchen_trainee',
        name: 'Kitchen Trainee',
        branch: 'kitchen',
        level: 0,
        isEntryLevel: true,
        salary: 0,
        pileSize: 12,
        is1x: false,
        promotesFrom: [],
        promotesTo: ['burger_cook', 'pizza_cook'],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.PRODUCE,
            items: [{ item: 'burger', quantity: 1 }, { item: 'pizza', quantity: 1 }],
            chooseOne: true,
            description: 'Produces 1 burger OR 1 pizza (choose one).',
        },
    },

    burger_cook: {
        id: 'burger_cook',
        name: 'Burger Cook',
        branch: 'kitchen',
        level: 1,
        isEntryLevel: false,
        salary: 5,
        pileSize: 6,
        is1x: false,
        promotesFrom: ['kitchen_trainee'],
        promotesTo: ['burger_chef'],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.PRODUCE,
            items: [{ item: 'burger', quantity: 3 }],
            description: 'Produces 3 burgers.',
        },
    },

    pizza_cook: {
        id: 'pizza_cook',
        name: 'Pizza Cook',
        branch: 'kitchen',
        level: 1,
        isEntryLevel: false,
        salary: 5,
        pileSize: 6,
        is1x: false,
        promotesFrom: ['kitchen_trainee'],
        promotesTo: ['pizza_chef'],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.PRODUCE,
            items: [{ item: 'pizza', quantity: 3 }],
            description: 'Produces 3 pizzas.',
        },
    },

    burger_chef: {
        id: 'burger_chef',
        name: 'Burger Chef',
        branch: 'kitchen',
        level: 2,
        isEntryLevel: false,
        salary: 5,
        pileSize: 3,
        is1x: true,
        promotesFrom: ['burger_cook'],
        promotesTo: [],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.PRODUCE,
            items: [{ item: 'burger', quantity: 7 }],
            description: 'Produces 7 burgers.',
        },
    },

    pizza_chef: {
        id: 'pizza_chef',
        name: 'Pizza Chef',
        branch: 'kitchen',
        level: 2,
        isEntryLevel: false,
        salary: 5,
        pileSize: 3,
        is1x: true,
        promotesFrom: ['pizza_cook'],
        promotesTo: [],
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.PRODUCE,
            items: [{ item: 'pizza', quantity: 7 }],
            description: 'Produces 7 pizzas.',
        },
    },

    // ═══════════════════════════════════════════
    // SERVICE BRANCH (roxa) — standalone
    // ═══════════════════════════════════════════
    waitress: {
        id: 'waitress',
        name: 'Waitress',
        branch: 'service',
        level: 0,
        isEntryLevel: true,
        salary: 0,
        pileSize: 12,
        is1x: false,
        promotesFrom: [],
        promotesTo: [],   // standalone
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.WAITRESS,
            cashPerActivation: 3,
            mandatory: true,
            description: 'Earns $3 during Dinnertime (counts for CFO). Tiebreaker for sales.',
        },
    },

    // ═══════════════════════════════════════════
    // PRICING BRANCH (rosa) — standalone entry
    // ═══════════════════════════════════════════
    pricing_manager: {
        id: 'pricing_manager',
        name: 'Pricing Manager',
        branch: 'pricing',
        level: 0,
        isEntryLevel: true,
        salary: 0,
        pileSize: 6,
        is1x: false,
        promotesFrom: [],
        promotesTo: [],   // standalone
        maxSubordinates: 0,
        action: {
            type: ACTION_TYPES.PRICE,
            priceModifier: -1,
            mandatory: true,
            description: 'Reduces unit price by $1 (mandatory).',
        },
    },
};

// ═══════════════════════════════════════════════
// CEO (special — not in supply, each player starts with 1)
// ═══════════════════════════════════════════════
const CEO = {
    id: 'ceo',
    name: 'CEO',
    branch: 'management',
    level: -1,   // special
    isEntryLevel: false,
    salary: 0,
    pileSize: 0, // not in supply — given at start
    is1x: false,
    promotesFrom: [],
    promotesTo: [],
    maxSubordinates: 3,  // default, may change with Bank Reserve
    action: {
        type: ACTION_TYPES.RECRUIT,
        uses: 1,
        hiringOnly: true,     // CEO can only hire, not take -$5 discount
        description: '1 free hire per turn (entry-level only). Cannot take salary discount.',
    },
};

// ═══════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════

/**
 * Get all entry-level employees (the only ones that can be hired)
 */
function getEntryLevelEmployees() {
    return Object.values(EMPLOYEES).filter(e => e.isEntryLevel);
}

/**
 * Get valid promotion targets for a given employee type
 * @param {string} employeeId - The employee type ID
 * @returns {string[]} Array of employee IDs this type can promote to
 */
function getValidPromotions(employeeId) {
    const employee = EMPLOYEES[employeeId];
    if (!employee) return [];
    return [...employee.promotesTo];
}

/**
 * Get the full promotion path from an employee to all reachable endpoints
 * @param {string} employeeId - Starting employee type
 * @returns {string[][]} Array of paths, each path is array of employee IDs
 */
function getPromotionPaths(employeeId) {
    const paths = [];

    function dfs(current, path) {
        const emp = EMPLOYEES[current];
        if (!emp || emp.promotesTo.length === 0) {
            if (path.length > 1) paths.push([...path]);
            return;
        }
        for (const next of emp.promotesTo) {
            path.push(next);
            dfs(next, path);
            path.pop();
        }
    }

    dfs(employeeId, [employeeId]);
    return paths;
}

/**
 * Get employee definition by ID
 * @param {string} id - Employee type ID
 * @returns {object|null} Employee definition or null
 */
function getEmployee(id) {
    if (id === 'ceo') return CEO;
    return EMPLOYEES[id] || null;
}

/**
 * Get all 1x restricted employee types
 */
function get1xEmployees() {
    return Object.values(EMPLOYEES).filter(e => e.is1x);
}

/**
 * Check if a training path is valid (employee A can eventually become employee B)
 * @param {string} fromId - Current employee type
 * @param {string} toId - Target employee type
 * @returns {boolean}
 */
function canTrainTo(fromId, toId) {
    const visited = new Set();

    function dfs(current) {
        if (current === toId) return true;
        if (visited.has(current)) return false;
        visited.add(current);

        const emp = EMPLOYEES[current];
        if (!emp) return false;

        for (const next of emp.promotesTo) {
            if (dfs(next)) return true;
        }
        return false;
    }

    return dfs(fromId);
}

// Export for both browser (global) and Node.js (require)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EMPLOYEES, CEO, BRANCHES, ACTION_TYPES, getEntryLevelEmployees, getValidPromotions, getPromotionPaths, getEmployee, get1xEmployees, canTrainTo };
}
