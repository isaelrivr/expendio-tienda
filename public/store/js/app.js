/**
 * app.js
 * Punto de entrada de la aplicación.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Instanciar el core de la aplicación
    const model = new StoreModel();
    const view = new StoreView();
    const controller = new StoreController(model, view);

    // Exportar para depuración (opcional)
    window.app = { model, view, controller };
    
    console.log("🚀 Expendio Store initialized successfully!");
});
