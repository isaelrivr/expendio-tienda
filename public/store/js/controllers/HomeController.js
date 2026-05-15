/**
 * HomeController.js
 * Capa de Controlador (C en MVC) para la página de inicio.
 * - Orquesta el flujo: recibe eventos, consulta el Model, delega el render a la View
 * - NO hace fetch() directamente (eso es del Model)
 * - NO manipula innerHTML directamente (eso es de la View)
 */
class HomeController {
    constructor() {
        this.model = new ProductoModel();
        this.carritoModel = new CarritoModel();
        this.view = new HomeView();
        this.init();
    }

    async init() {
        try {
            const productos = await this.model.getAll();
            // Tomamos los primeros 4 productos como destacados
            this.view.renderBestSellers(productos.slice(0, 4));
            this.setupListeners();
        } catch (error) {
            console.error('Error inicializando home:', error);
        }
    }

    setupListeners() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-agregar');
            if (btn) {
                const id = btn.dataset.id;
                this.agregarAlCarrito(id);
            }
        });
    }

    async agregarAlCarrito(id) {
        try {
            const btn = document.querySelector(`.btn-agregar[data-id="${id}"]`);
            const originalHTML = btn ? btn.innerHTML : '';

            this.view.actualizarBtnAgregar(id, 'loading', originalHTML);

            const producto = await this.model.getById(id);
            this.carritoModel.agregar(producto);
            window.abrirCartDrawer();

            setTimeout(() => {
                this.view.actualizarBtnAgregar(id, 'idle', originalHTML);
            }, 1500);
        } catch (error) {
            console.error(error);
            Toast.show('Error al agregar producto', 'error');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new HomeController());
