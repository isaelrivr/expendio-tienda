/**
 * ProductoController.js
 * Capa de Controlador (C en MVC) para la página de detalle de producto.
 * - Orquesta: eventos de usuario → Model (datos) → View (render)
 * - NO manipula innerHTML directamente (eso es de ProductoView)
 * - NO hace fetch() directamente (eso es de ProductoModel)
 */
class ProductoController {
    constructor() {
        this.model = new ProductoModel();
        this.carritoModel = new CarritoModel();
        this.view = new ProductoView();
        this.productoActual = null;
        this.cantidad = 1;

        this.init();
    }

    async init() {
        try {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');
            if (!id) return window.location.href = '/store/catalogo.html';

            // Model: obtiene los datos
            this.productoActual = await this.model.getById(id);
            if (!this.productoActual) {
                Toast.show('Producto no encontrado', 'error');
                return window.location.href = '/store/catalogo.html';
            }

            // View: renderiza los datos
            this.view.renderProducto(this.productoActual);

            // Cargar relacionados y configurar eventos
            await this.cargarRelacionados();
            this.setupListeners();
        } catch (error) {
            console.error('Error cargando producto:', error);
            Toast.show('Error al cargar detalle', 'error');
        }
    }

    async cargarRelacionados() {
        try {
            if (!this.productoActual?.categoria) {
                this.view.renderRelacionados([]);
                return;
            }

            // Model: obtiene los datos relacionados
            const relacionados = await this.model.getPorCategoria(this.productoActual.categoria);

            // Filtrar el producto actual y mezclar aleatoriamente
            const filtrados = relacionados
                .filter(p => p.id != this.productoActual.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 4);

            // View: renderiza los relacionados
            this.view.renderRelacionados(filtrados);
        } catch (error) {
            console.error('Error cargando relacionados:', error);
            this.view.renderRelacionadosError();
        }
    }

    setupListeners() {
        document.body.addEventListener('click', (e) => {
            if (e.target.closest('#btn-plus')) {
                this.cantidad++;
                this.view.actualizarCantidad(this.cantidad);
            }

            if (e.target.closest('#btn-minus')) {
                if (this.cantidad > 1) {
                    this.cantidad--;
                    this.view.actualizarCantidad(this.cantidad);
                }
            }

            if (e.target.closest('#btn-agregar-detalle')) {
                const btn = document.getElementById('btn-agregar-detalle');
                const originalHTML = btn ? btn.innerHTML : '';

                // View: feedback inmediato
                this.view.actualizarBtnAgregar('added', originalHTML);

                // Model: agregar al carrito
                this.carritoModel.agregar(this.productoActual, this.cantidad);
                window.abrirCartDrawer();

                setTimeout(() => {
                    this.view.actualizarBtnAgregar('idle', originalHTML);
                }, 1500);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new ProductoController());
