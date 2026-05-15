/**
 * views/ProductoView.js
 * Capa de Vista (V en MVC) para la página de detalle de producto.
 * - Responsable ÚNICAMENTE de manipular el DOM
 * - NO hace fetch() ni lógica de negocio
 * - Recibe datos del Controller y los renderiza
 */
class ProductoView {

    /**
     * Renderiza el detalle completo de un producto
     * @param {Object} p - Objeto producto del modelo
     */
    renderProducto(p) {
        const container = document.getElementById('producto-container');
        if (!container) return;

        container.innerHTML = `
            <div class="col-md-6 fadeIn">
                <div class="product-card overflow-hidden h-100">
                    <img src="${p.imagen || 'https://images.unsplash.com/photo-1544145945-f904253d0c71?auto=format&fit=crop&q=80&w=800'}" 
                         class="w-100 h-100 object-fit-cover" alt="${p.nombre}">
                </div>
            </div>
            <div class="col-md-6 slideUp">
                <div class="mb-2">
                    <span class="badge bg-primary rounded-pill px-3">${p.categoria}</span>
                    <span class="ms-2 text-light opacity-50 small">SKU: ${p.codigo_barras}</span>
                </div>
                <h1 class="fw-bold mb-1">${p.nombre}</h1>
                <h4 class="text-secondary mb-4">${p.marca}</h4>
                
                <div class="card-price mb-4" style="font-size: 3rem;">$${parseFloat(p.precio).toFixed(2)}</div>
                
                <p class="text-light opacity-75 mb-5">${p.descripcion || 'Sin descripción disponible para este producto.'}</p>
                
                <div class="d-flex align-items-center gap-4 mb-5">
                    <div class="d-flex align-items-center gap-2">
                        <button class="qty-btn" id="btn-minus"><i class="fa-solid fa-minus"></i></button>
                        <input type="text" class="qty-input" id="qty-input" value="1" readonly>
                        <button class="qty-btn" id="btn-plus"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    <button class="btn-add py-3 px-5 m-0" id="btn-agregar-detalle">
                        <i class="fa-solid fa-cart-shopping me-2"></i> AGREGAR AL CARRITO
                    </button>
                </div>

                <div class="row g-3">
                    <div class="col-6">
                        <div class="spec-label">Presentación</div>
                        <div class="fw-bold">${p.unidad_medida}</div>
                    </div>
                    <div class="col-6">
                        <div class="spec-label">Disponibilidad</div>
                        <div class="fw-bold text-success">${p.stock} unidades</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza la sección de productos relacionados
     * @param {Array} productos - Productos de la misma categoría
     */
    renderRelacionados(productos) {
        const grid = document.getElementById('related-grid');
        if (!grid) return;

        if (!productos || productos.length === 0) {
            grid.innerHTML = '<p class="text-light opacity-50">No hay otros productos en esta categoría.</p>';
            return;
        }

        grid.innerHTML = productos.map(p => `
            <div class="col-md-3 col-6 slideUp">
                <div class="product-card h-100 d-flex flex-column">
                    <div class="card-img-container" style="cursor: pointer;" 
                         onclick="window.location.href='/store/producto.html?id=${p.id}'">
                        <img src="${p.imagen || 'https://images.unsplash.com/photo-1544145945-f904253d0c71?auto=format&fit=crop&q=80&w=400'}" 
                             alt="${p.nombre}" class="card-img">
                    </div>
                    <div class="card-body p-3 d-flex flex-column flex-grow-1">
                        <div class="card-brand small opacity-50">${p.marca}</div>
                        <h6 class="mb-2 text-truncate fw-bold">${p.nombre}</h6>
                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            <span class="fw-bold text-info">$${parseFloat(p.precio).toFixed(2)}</span>
                            <a href="/store/producto.html?id=${p.id}" class="btn btn-sm btn-outline-info rounded-pill px-3">Ver</a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Muestra error al cargar productos relacionados
     */
    renderRelacionadosError() {
        const grid = document.getElementById('related-grid');
        if (grid) grid.innerHTML = '<div class="alert alert-dark border-0 rounded-4 opacity-75">No se pudieron cargar las recomendaciones en este momento.</div>';
    }

    /**
     * Actualiza el contador de cantidad en el detalle de producto
     * @param {number} cantidad
     */
    actualizarCantidad(cantidad) {
        const input = document.getElementById('qty-input');
        if (input) input.value = cantidad;
    }

    /**
     * Cambia el estado del botón de agregar al carrito
     * @param {'added'|'idle'} estado
     * @param {string} originalHTML
     */
    actualizarBtnAgregar(estado, originalHTML = '') {
        const btn = document.getElementById('btn-agregar-detalle');
        if (!btn) return;

        if (estado === 'added') {
            btn.disabled = true;
            btn.classList.add('added');
            btn.innerHTML = '<i class="fa-solid fa-check me-2"></i> ¡AÑADIDO!';
        } else {
            btn.classList.remove('added');
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }
    }
}
