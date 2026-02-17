// Food Chain Magnate - Application Entry Point
// Bootstraps the MVC architecture

document.addEventListener('DOMContentLoaded', () => {
    console.log('🍔 Food Chain Magnate Online - Starting...');

    // Model
    const model = new GameState();

    // View
    const view = new GameView();

    // Controller (wires Model + View together)
    const controller = new GameController(model, view);

    // Make available globally for debugging
    window.game = { model, view, controller };

    console.log('✅ Game initialized (MVC Architecture)');
    console.log('📦 Model:      window.game.model');
    console.log('🎨 View:       window.game.view');
    console.log('🎮 Controller: window.game.controller');
    console.log('');
    console.log('💡 Keyboard shortcuts:');
    console.log('   H - Open hiring menu');
    console.log('   Enter - End turn');
    console.log('   Escape - Close modals');
});

// Debug helpers (globally accessible)
function produceFood(type) {
    const model = window.game.model;
    const player = model.getCurrentPlayer();
    model.produceFood(player.id, type);
    window.game.view.updateDashboard(player);
    window.game.view.showNotification(`Produced ${type}!`);
}

function addMoney(amount) {
    const player = window.game.model.getCurrentPlayer();
    player.money += amount;
    window.game.view.updateDashboard(player);
    window.game.view.showNotification(`Added $${amount}!`);
}

console.log('💡 Debug commands:');
console.log('   produceFood("burgers") / produceFood("pizza") / produceFood("drinks")');
console.log('   addMoney(50)');
