/**
 * views/HomeView.js
 * Capa de Vista (V en MVC) para la página de inicio.
 * - Responsable ÚNICAMENTE de manipular el DOM
 * - NO hace fetch() ni lógica de negocio
 * - Recibe datos del Controller y los renderiza
 */
class HomeView {

    /**
     * Renderiza la grilla de productos destacados (best sellers)
     * @param {Array} productos - Array de productos del modelo
     */
    renderBestSellers(productos) {
        const grid = document.getElementById('best-sellers-grid');
        if (!grid) return;

        if (!productos || productos.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center py-5 opacity-50">
                    <i class="fa-solid fa-box-open fs-1 mb-3"></i>
                    <p>No hay productos disponibles en este momento.</p>
                </div>`;
            return;
        }

        grid.innerHTML = productos.map(p => `
            <div class="col-md-3 col-6 slideUp">
                <div class="product-card">
                    <div class="card-img-container">
                        <img src="${p.imagen || 'https://images.unsplash.com/photo-1544145945-f904253d0c71?auto=format&fit=crop&q=80&w=400'}" 
                             alt="${p.nombre}" class="card-img" style="cursor: pointer;" 
                             onclick="window.location.href='/store/producto.html?id=${p.id}'">
                        <a href="/store/producto.html?id=${p.id}" class="quick-view-btn">
                            <i class="fa-solid fa-eye me-1"></i> Vista rápida
                        </a>
                    </div>
                    <div class="card-body">
                        <div class="card-brand">${p.marca || 'Genérico'}</div>
                        <h5 class="card-title">${p.nombre}</h5>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="card-price">$${parseFloat(p.precio).toFixed(2)}</span>
                            <button class="btn-add btn-sm w-auto px-3 py-2 btn-agregar" data-id="${p.id}">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Muestra estado de botón de agregar al carrito
     * @param {string} id - ID del producto
     * @param {'loading'|'success'|'idle'} estado
     * @param {string} originalHTML - HTML original del botón para restaurar
     */
    actualizarBtnAgregar(id, estado, originalHTML = '') {
        const btn = document.querySelector(`.btn-agregar[data-id="${id}"]`);
        if (!btn) return;

        if (estado === 'loading') {
            btn.disabled = true;
            btn.classList.add('added');
            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        } else if (estado === 'idle') {
            btn.classList.remove('added');
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }
    }
}
