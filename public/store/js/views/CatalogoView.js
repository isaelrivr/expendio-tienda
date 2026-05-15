/**
 * views/CatalogoView.js
 * Capa de Vista (V en MVC) para la página del catálogo.
 * - Responsable ÚNICAMENTE de manipular el DOM
 * - NO hace fetch() ni lógica de negocio
 * - Recibe datos del Controller y los renderiza
 */
class CatalogoView {

    /**
     * Muestra skeletons de carga mientras se obtienen los productos
     * @param {number} cantidad - Número de skeletons a mostrar
     */
    renderSkeletons(cantidad = 8) {
        const grid = document.getElementById('catalogo-grid');
        if (!grid) return;

        grid.innerHTML = Array(cantidad).fill(`
            <div class="col-xl-3 col-lg-4 col-md-6 col-12">
                <div class="skeleton-card">
                    <div class="skeleton skeleton-img"></div>
                    <div class="skeleton skeleton-line short"></div>
                    <div class="skeleton skeleton-line medium"></div>
                    <div class="skeleton skeleton-line"></div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Renderiza las pills de categorías
     * @param {Array<string>} categorias - Lista de categorías disponibles
     * @param {string} activa - Categoría actualmente seleccionada
     */
    renderCategorias(categorias, activa = 'all') {
        const container = document.getElementById('category-pills');
        if (!container) return;

        const allPill = `<a href="#" class="cat-pill ${activa === 'all' ? 'active' : ''}" data-cat="all">Todos</a>`;
        const pills = categorias.map(cat =>
            `<a href="#" class="cat-pill ${activa === cat ? 'active' : ''}" data-cat="${cat}">${cat}</a>`
        ).join('');

        container.innerHTML = allPill + pills;
    }

    /**
     * Renderiza la grilla de productos
     * @param {Array} productos - Productos filtrados del modelo
     * @param {Array} itemsCarrito - Items actuales del carrito para mostrar qty buttons
     */
    renderGrid(productos, itemsCarrito = []) {
        const grid = document.getElementById('catalogo-grid');
        const emptyState = document.getElementById('empty-state');
        const countEl = document.getElementById('results-count');

        if (!grid) return;

        if (productos.length === 0) {
            grid.innerHTML = '';
            if (emptyState) emptyState.classList.remove('d-none');
            if (countEl) countEl.innerText = '0 productos encontrados';
            return;
        }

        if (emptyState) emptyState.classList.add('d-none');
        if (countEl) countEl.innerText = `${productos.length} productos encontrados`;

        grid.innerHTML = productos.map(p => {
            const itemEnCarrito = itemsCarrito.find(i => i.id == p.id);

            const accionHTML = itemEnCarrito ? `
                <div class="d-flex align-items-center gap-2">
                    <button class="qty-btn btn-agregar" data-id="${p.id}" data-delta="-1">
                        <i class="fa-solid fa-minus"></i>
                    </button>
                    <span class="fw-bold px-2 qty-display" style="min-width:30px; text-align:center;">
                        ${itemEnCarrito.cantidad}
                    </span>
                    <button class="qty-btn btn-agregar" data-id="${p.id}" data-delta="1">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            ` : `
                <button class="btn-add btn-sm w-auto px-4 btn-agregar" data-id="${p.id}">
                    <i class="fa-solid fa-cart-plus me-1"></i> Agregar
                </button>
            `;

            return `
                <div class="col-xl-3 col-lg-4 col-md-6 col-12 slideUp">
                    <div class="product-card">
                        <div class="card-img-container">
                            <img src="${p.imagen || 'https://images.unsplash.com/photo-1544145945-f904253d0c71?auto=format&fit=crop&q=80&w=400'}" 
                                 alt="${p.nombre}" class="card-img" style="cursor: pointer;" 
                                 onclick="window.location.href='/store/producto.html?id=${p.id}'">
                            ${p.stock <= p.stock_minimo ? '<span class="position-absolute top-0 end-0 m-3 badge bg-danger rounded-pill">Stock bajo</span>' : ''}
                            <a href="/store/producto.html?id=${p.id}" class="quick-view-btn">
                                <i class="fa-solid fa-eye me-1"></i> Vista rápida
                            </a>
                        </div>
                        <div class="card-body">
                            <div class="card-brand">${p.marca || 'Genérico'}</div>
                            <h5 class="card-title">${p.nombre}</h5>
                            <div class="d-flex justify-content-between align-items-center mt-3">
                                <span class="card-price">$${parseFloat(p.precio).toFixed(2)}</span>
                                <div id="accion-container-${p.id}">
                                    ${accionHTML}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Actualiza el estado visual del botón de agregar
     * @param {string} id - ID del producto
     * @param {'added'|'idle'} estado
     * @param {string} originalHTML
     */
    actualizarBtnAgregar(id, estado, originalHTML = '') {
        const btn = document.querySelector(`.btn-agregar[data-id="${id}"]:not(.qty-btn)`);
        if (!btn) return;

        if (estado === 'added') {
            btn.disabled = true;
            btn.classList.add('added');
            btn.innerHTML = '<i class="fa-solid fa-check me-1"></i> ¡Agregado!';
        } else {
            btn.classList.remove('added');
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }
    }
}
