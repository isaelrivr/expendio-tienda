/**
 * CatalogoController.js
 * Capa de Controlador (C en MVC) para la página del catálogo.
 * - Orquesta: eventos de usuario → Model (datos) → View (render)
 * - NO manipula innerHTML directamente (eso es de CatalogoView)
 * - NO hace fetch() directamente (eso es de ProductoModel)
 */
class CatalogoController {
    constructor() {
        this.model = new ProductoModel();
        this.carritoModel = new CarritoModel();
        this.view = new CatalogoView();

        this.productosOriginales = [];
        this.currentCat = 'all';
        this.searchTimeout = null;

        this.init();
    }

    async init() {
        try {
            // 1. Mostrar skeletons mientras carga
            this.view.renderSkeletons(8);

            // 2. Leer parámetros de URL
            const params = new URLSearchParams(window.location.search);
            const catParam = params.get('cat');
            const qParam = params.get('q');

            // 3. Cargar productos desde el Model
            this.productosOriginales = await this.model.getAll();

            // 4. Extraer categorías únicas y renderizarlas (via View)
            const categorias = [...new Set(this.productosOriginales.map(p => p.categoria).filter(Boolean))];
            if (catParam) this.currentCat = catParam;
            this.view.renderCategorias(categorias, this.currentCat);

            // 5. Sincronizar buscador con URL si viene ?q=
            if (qParam) {
                const searchInput = document.getElementById('global-search');
                if (searchInput) searchInput.value = qParam;
            }

            // 6. Renderizar con filtros iniciales
            this.aplicarFiltros();

            // 7. Configurar eventos
            this.setupListeners();
        } catch (error) {
            console.error('Error inicializando catálogo:', error);
            Toast.show('Error al cargar productos', 'error');
        }
    }

    setupListeners() {
        // Filtros por categoría
        const categoryPills = document.getElementById('category-pills');
        if (categoryPills) {
            categoryPills.addEventListener('click', (e) => {
                const pill = e.target.closest('.cat-pill');
                if (!pill) return;
                e.preventDefault();

                document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                this.currentCat = pill.dataset.cat;
                this.aplicarFiltros();
            });
        }

        // Búsqueda con buscador global del navbar
        const globalSearch = document.getElementById('global-search');
        if (globalSearch) {
            globalSearch.addEventListener('input', () => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => this.aplicarFiltros(), 300);
            });
        }

        // Selector de ordenamiento
        const ordenar = document.getElementById('ordenar');
        if (ordenar) {
            ordenar.addEventListener('change', () => this.aplicarFiltros());
        }

        // Limpiar filtros
        const btnLimpiar = document.getElementById('btn-limpiar');
        if (btnLimpiar) {
            btnLimpiar.addEventListener('click', () => {
                const searchInput = document.getElementById('global-search');
                if (searchInput) searchInput.value = '';
                this.currentCat = 'all';
                document.querySelectorAll('.cat-pill').forEach(p => {
                    p.classList.toggle('active', p.dataset.cat === 'all');
                });
                this.aplicarFiltros();
            });
        }

        // Agregar al carrito (event delegation)
        const catalogoGrid = document.getElementById('catalogo-grid');
        if (catalogoGrid) {
            catalogoGrid.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-agregar');
                if (btn) {
                    const id = btn.dataset.id;
                    const delta = parseInt(btn.dataset.delta || '1');
                    this.agregarAlCarrito(id, delta);
                }
            });
        }

        // Refrescar grid al actualizar carrito
        window.addEventListener('carrito-actualizado', () => this.aplicarFiltros());
    }

    /**
     * Delega al Model el filtrado de datos, luego a la View el render.
     * El Controller SOLO coordina, no filtra ni renderiza.
     */
    aplicarFiltros() {
        const searchInput = document.getElementById('global-search');
        const sortSelect = document.getElementById('ordenar');

        const query = searchInput ? searchInput.value : '';
        const sort = sortSelect ? sortSelect.value : 'nombre-asc';

        // Model: lógica de filtrado y ordenamiento
        const productosFiltrados = this.model.filtrar(this.productosOriginales, {
            categoria: this.currentCat,
            query: query,
            sort: sort
        });

        // View: renderizado del resultado
        this.view.renderGrid(productosFiltrados, this.carritoModel.items);
    }

    async agregarAlCarrito(id, delta = 1) {
        try {
            // Feedback visual inmediato via View
            const btn = document.querySelector(`.btn-agregar[data-id="${id}"]:not(.qty-btn)`);
            const originalHTML = btn ? btn.innerHTML : '';
            if (btn && delta > 0) {
                this.view.actualizarBtnAgregar(id, 'added', originalHTML);
            }

            // Lógica de negocio: agregar/quitar del carrito
            const producto = this.productosOriginales.find(p => p.id == id);
            if (!producto) return;

            this.carritoModel.agregar(producto, delta);

            const item = this.carritoModel.items.find(i => i.id == id);
            if (item && item.cantidad <= 0) {
                this.carritoModel.eliminar(id);
            }

            window.abrirCartDrawer();

            // Restaurar botón y actualizar grid
            setTimeout(() => {
                if (btn && delta > 0) this.view.actualizarBtnAgregar(id, 'idle', originalHTML);
                this.aplicarFiltros();
            }, 1500);
        } catch (error) {
            console.error(error);
            Toast.show('Error al agregar', 'error');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new CatalogoController());
