// Food Chain Magnate - Org Chart (per-player tree structure)
// CEO at root, managers extend the tree, beach holds inactive employees

class OrgChart {
    /**
     * @param {number} ceoSlots - Number of direct subordinate slots for CEO (2, 3, or 4)
     */
    constructor(ceoSlots = 3) {
        // Tree stored as adjacency list: nodeId → { employeeId, parentId, children[] }
        this._nodes = new Map();
        this._beach = [];       // employees not in org chart (trainable)
        this._nextNodeId = 1;

        // CEO is always at root
        this._ceoNodeId = 0;
        this._nodes.set(0, {
            nodeId: 0,
            employeeId: 'ceo',
            instanceId: 'ceo_0',       // unique per employee instance
            parentId: null,
            children: [],
            maxChildren: ceoSlots,
        });
    }

    // ═══════════════════════════════════════════
    // QUERIES
    // ═══════════════════════════════════════════

    /**
     * Get the CEO node
     */
    getCEO() {
        return this._nodes.get(this._ceoNodeId);
    }

    /**
     * Get a node by its nodeId
     */
    getNode(nodeId) {
        return this._nodes.get(nodeId) || null;
    }

    /**
     * Get all nodes in the tree (at work)
     * @returns {object[]}
     */
    getAtWork() {
        return Array.from(this._nodes.values());
    }

    /**
     * Get all employees on the beach (inactive)
     * @returns {object[]} Array of { instanceId, employeeId }
     */
    getAtBeach() {
        return [...this._beach];
    }

    /**
     * Get all employees (both at work and on beach)
     */
    getAllEmployees() {
        const atWork = this.getAtWork().map(n => ({
            instanceId: n.instanceId,
            employeeId: n.employeeId,
            location: 'work',
            nodeId: n.nodeId,
        }));
        const atBeach = this._beach.map(b => ({
            instanceId: b.instanceId,
            employeeId: b.employeeId,
            location: 'beach',
        }));
        return [...atWork, ...atBeach];
    }

    /**
     * Find node by instance ID (within tree)
     */
    findNodeByInstanceId(instanceId) {
        for (const node of this._nodes.values()) {
            if (node.instanceId === instanceId) return node;
        }
        return null;
    }

    /**
     * Find beach employee by instance ID
     */
    findBeachByInstanceId(instanceId) {
        return this._beach.find(b => b.instanceId === instanceId) || null;
    }

    /**
     * Get open slots (nodes with room for more children)
     * @returns {object[]} Array of { nodeId, employeeId, availableSlots }
     */
    getOpenSlots() {
        const slots = [];
        for (const node of this._nodes.values()) {
            if (node.maxChildren > 0 && node.children.length < node.maxChildren) {
                slots.push({
                    nodeId: node.nodeId,
                    employeeId: node.employeeId,
                    instanceId: node.instanceId,
                    availableSlots: node.maxChildren - node.children.length,
                });
            }
        }
        return slots;
    }

    /**
     * Get total number of open work slots (for Order of Business turn order)
     */
    getTotalOpenSlots() {
        return this.getOpenSlots().reduce((sum, s) => sum + s.availableSlots, 0);
    }

    /**
     * Count employees of a specific type (at work + beach)
     * @param {string} employeeId - Employee type to count
     */
    countByType(employeeId) {
        let count = 0;
        for (const node of this._nodes.values()) {
            if (node.employeeId === employeeId) count++;
        }
        for (const b of this._beach) {
            if (b.employeeId === employeeId) count++;
        }
        return count;
    }

    /**
     * Count employees at work of a given type
     */
    countAtWorkByType(employeeId) {
        let count = 0;
        for (const node of this._nodes.values()) {
            if (node.employeeId === employeeId) count++;
        }
        return count;
    }

    // ═══════════════════════════════════════════
    // MUTATIONS
    // ═══════════════════════════════════════════

    /**
     * Hire a new employee → goes to beach
     * @param {string} employeeId - Employee type ID
     * @returns {object} The new beach entry { instanceId, employeeId }
     */
    hireToBeach(employeeId) {
        const instanceId = `${employeeId}_${this._nextNodeId++}`;
        const entry = { instanceId, employeeId };
        this._beach.push(entry);
        return entry;
    }

    /**
     * Assign a beach employee to a parent node in the tree
     * @param {string} instanceId - Instance to assign
     * @param {number} parentNodeId - Parent node to assign under
     * @returns {{ success: boolean, reason?: string, nodeId?: number }}
     */
    assignToTree(instanceId, parentNodeId) {
        // Find on beach
        const beachIdx = this._beach.findIndex(b => b.instanceId === instanceId);
        if (beachIdx === -1) {
            return { success: false, reason: 'not_on_beach' };
        }

        // Check parent exists and has room
        const parent = this._nodes.get(parentNodeId);
        if (!parent) {
            return { success: false, reason: 'invalid_parent' };
        }
        if (parent.maxChildren <= 0) {
            return { success: false, reason: 'parent_cannot_have_children' };
        }
        if (parent.children.length >= parent.maxChildren) {
            return { success: false, reason: 'parent_full' };
        }

        const beachEntry = this._beach[beachIdx];
        const empDef = getEmployee(beachEntry.employeeId);
        if (!empDef) {
            return { success: false, reason: 'unknown_employee_type' };
        }

        // Create tree node
        const nodeId = this._nextNodeId++;
        const node = {
            nodeId,
            employeeId: beachEntry.employeeId,
            instanceId: beachEntry.instanceId,
            parentId: parentNodeId,
            children: [],
            maxChildren: empDef.maxSubordinates || 0,
        };

        this._nodes.set(nodeId, node);
        parent.children.push(nodeId);

        // Remove from beach
        this._beach.splice(beachIdx, 1);

        return { success: true, nodeId };
    }

    /**
     * Send a tree employee back to beach
     * @param {number} nodeId - Node to remove (cannot be CEO)
     * @returns {{ success: boolean, reason?: string, displaced?: object[] }}
     */
    sendToBeach(nodeId) {
        if (nodeId === this._ceoNodeId) {
            return { success: false, reason: 'cannot_remove_ceo' };
        }

        const node = this._nodes.get(nodeId);
        if (!node) {
            return { success: false, reason: 'node_not_found' };
        }

        // Recursively collect all descendants → they all go to beach too
        const displaced = [];
        const collectDescendants = (nId) => {
            const n = this._nodes.get(nId);
            if (!n) return;
            for (const childId of n.children) {
                collectDescendants(childId);
            }
            if (nId !== nodeId) {
                displaced.push({ instanceId: n.instanceId, employeeId: n.employeeId });
            }
            this._nodes.delete(nId);
        };

        // Collect all children first
        for (const childId of node.children) {
            collectDescendants(childId);
        }

        // Remove this node from parent's children
        const parent = this._nodes.get(node.parentId);
        if (parent) {
            parent.children = parent.children.filter(id => id !== nodeId);
        }

        // Add this employee + all displaced to beach
        this._beach.push({ instanceId: node.instanceId, employeeId: node.employeeId });
        for (const d of displaced) {
            this._beach.push(d);
        }

        this._nodes.delete(nodeId);

        return { success: true, displaced };
    }

    /**
     * Remove an employee entirely (fired — returns to supply)
     * @param {string} instanceId - Instance to fire
     * @returns {{ success: boolean, reason?: string, employeeId?: string }}
     */
    fireEmployee(instanceId) {
        // Check beach first
        const beachIdx = this._beach.findIndex(b => b.instanceId === instanceId);
        if (beachIdx !== -1) {
            const entry = this._beach.splice(beachIdx, 1)[0];
            return { success: true, employeeId: entry.employeeId };
        }

        // Check tree (send to beach first, then remove from beach)
        const node = this.findNodeByInstanceId(instanceId);
        if (node && node.nodeId !== this._ceoNodeId) {
            const result = this.sendToBeach(node.nodeId);
            if (result.success) {
                // Remove from beach
                const idx = this._beach.findIndex(b => b.instanceId === instanceId);
                if (idx !== -1) {
                    this._beach.splice(idx, 1);
                }
                return { success: true, employeeId: node.employeeId, displaced: result.displaced };
            }
        }

        return { success: false, reason: 'not_found' };
    }

    /**
     * Train a beach employee to a new type
     * @param {string} instanceId - Instance to train
     * @param {string} newEmployeeId - Target employee type
     * @returns {{ success: boolean, reason?: string }}
     */
    trainEmployee(instanceId, newEmployeeId) {
        const beachIdx = this._beach.findIndex(b => b.instanceId === instanceId);
        if (beachIdx === -1) {
            return { success: false, reason: 'not_on_beach' };
        }

        const entry = this._beach[beachIdx];
        const currentDef = getEmployee(entry.employeeId);
        if (!currentDef) {
            return { success: false, reason: 'unknown_current_type' };
        }

        // Validate promotion path
        if (!currentDef.promotesTo.includes(newEmployeeId)) {
            return { success: false, reason: 'invalid_promotion' };
        }

        // Update the employee type (keep same instanceId for tracking)
        entry.employeeId = newEmployeeId;
        // Update instanceId to reflect new type
        const newInstanceId = `${newEmployeeId}_${this._nextNodeId++}`;
        entry.instanceId = newInstanceId;

        return { success: true, newInstanceId };
    }

    /**
     * Update CEO's subordinate slots (e.g., Bank Reserve or milestone)
     * @param {number} slots - New number of slots
     */
    setCEOSlots(slots) {
        const ceo = this._nodes.get(this._ceoNodeId);
        if (ceo) {
            ceo.maxChildren = slots;
        }
    }

    // ═══════════════════════════════════════════
    // SERIALIZATION (for network sync)
    // ═══════════════════════════════════════════

    /**
     * Serialize the org chart to a plain object (for JSON / WebSocket)
     */
    toJSON() {
        const nodes = {};
        for (const [id, node] of this._nodes) {
            nodes[id] = { ...node, children: [...node.children] };
        }
        return {
            nodes,
            beach: this._beach.map(b => ({ ...b })),
            nextNodeId: this._nextNodeId,
            ceoNodeId: this._ceoNodeId,
        };
    }

    /**
     * Restore from serialized data
     */
    static fromJSON(data) {
        const chart = new OrgChart(3);
        chart._nodes = new Map();
        for (const [id, node] of Object.entries(data.nodes)) {
            chart._nodes.set(parseInt(id), { ...node, children: [...node.children] });
        }
        chart._beach = data.beach.map(b => ({ ...b }));
        chart._nextNodeId = data.nextNodeId;
        chart._ceoNodeId = data.ceoNodeId;
        return chart;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrgChart;
}
