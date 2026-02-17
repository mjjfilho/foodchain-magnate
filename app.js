// Food Chain Magnate Online — Entry Point
// Initializes MVC architecture and wires components together

document.addEventListener('DOMContentLoaded', () => {
    // ─── Create Model ───
    const model = new GameState({
        playerCount: 2,
        playerNames: ['Player 1', 'Player 2'],
        beginnerMode: true,  // No Bank Reserve, $150 bank
    });

    // ─── Create View ───
    const view = new GameView();

    // ─── Create Controller ───
    const controller = new GameController(model, view);

    // ─── Debug Globals ───
    window.game = {
        model,
        view,
        controller,
        // Quick-access helpers
        hire: (empId) => model.hireEmployee(model.getActivePlayerId(), empId),
        assign: (instanceId, parentNode) => model.assignEmployee(model.getActivePlayerId(), instanceId, parentNode),
        train: (instanceId, targetId) => model.trainEmployee(model.getActivePlayerId(), instanceId, targetId),
        sell: (items, isGarden) => model.processSale(model.getActivePlayerId(), items, isGarden),
        nextPhase: () => model.nextPhase(),
        nextPlayer: () => model.nextPlayer(),
        state: () => console.log(JSON.stringify(model.state, null, 2)),
        player: (id) => model.getPlayer(id || model.getActivePlayerId()),
    };

    console.log('%c🍔 Food Chain Magnate Online', 'font-size: 1.4em; font-weight: bold; color: #BF4646;');
    console.log('Debug: window.game.model / .view / .controller');
    console.log('Shortcuts: game.hire("kitchen_trainee"), game.nextPhase(), game.state()');
});
