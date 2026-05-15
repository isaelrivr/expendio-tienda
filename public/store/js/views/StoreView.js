/**
 * StoreView.js
 * Encargado de toda la manipulación del DOM y renderizado.
 */
class StoreView {
    constructor() {
        this.productList = document.getElementById('product-list');
        this.categoryContainer = document.getElementById('category-pills');
        this.cartItemsContainer = document.getElementById('cart-items');
        this.cartCount = document.getElementById('cart-count');
        this.cartTotal = document.getElementById('cart-total');
        this.cartDrawer = document.getElementById('cart-drawer');
        this.cartOverlay = document.getElementById('cart-overlay');
        
        this.searchLines = [];
    }

    /**
     * Corrige problemas comunes de encoding (UTF-8 double encoding)
     */
    fixEncoding(text) {
        if (!text) return '';
        try {
            // Intento de corregir "EnergÃ©ticas" -> "Energéticas"
            return decodeURIComponent(escape(text));
        } catch (e) {
            return text;
        }
    }

    /**
     * Renderiza las "pills" de categorías
     */
    renderCategories(categories) {
        let html = '<a href="#" class="category-pill active" data-category="all">Todos</a>';
        categories.forEach(cat => {
            const cleanCat = this.fixEncoding(cat);
            html += `<a href="#" class="category-pill" data-category="${cat}">${cleanCat}</a>`;
        });
        this.categoryContainer.innerHTML = html;
    }

    /**
     * Renderiza las cards de productos
     */
    renderProducts(products) {
        if (products.length === 0) {
            this.productList.innerHTML = `
                <div class="text-center py-5 w-100 grid-span-full opacity-50">
                    <i class="fa-solid fa-box-open fs-1 mb-3"></i>
                    <p>No se encontraron productos disponibles.</p>
                </div>
            `;
            return;
        }

        // Mapeo de imágenes por categoría para evitar cuadros vacíos
        const categoryImages = {
            'Refrescos': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400',
            'Cervezas': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80&w=400',
            'Jugos': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=400',
            'Agua': 'https://images.unsplash.com/photo-1560023907-5f339617ea30?auto=format&fit=crop&q=80&w=400',
            'Energéticas': 'https://images.unsplash.com/photo-1622543953491-f17046df1f0f?auto=format&fit=crop&q=80&w=400',
            'Vinos': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=400'
        };

        let html = '';
        products.forEach(product => {
            const cleanName = this.fixEncoding(product.nombre);
            const cleanCat = this.fixEncoding(product.categoria);
            
            // Prioridad: imagen de DB -> imagen por categoría -> imagen genérica
            const imageUrl = product.imagen || categoryImages[cleanCat] || categoryImages[product.categoria] || `https://images.unsplash.com/photo-1544145945-f904253d0c71?auto=format&fit=crop&q=80&w=400`;
            
            html += `
                <div class="product-card" data-id="${product.id}" data-category="${product.categoria}">
                    <div class="product-img-wrapper">
                        <img src="${imageUrl}" alt="${cleanName}" class="product-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400'">
                        ${product.stock <= product.stock_minimo ? '<span class="product-badge bg-danger">Pocas piezas</span>' : ''}
                    </div>
                    <div class="product-info">
                        <div class="product-brand">${product.marca || 'Genérico'}</div>
                        <h3 class="product-name">${cleanName}</h3>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="product-price">$${parseFloat(product.precio).toFixed(2)}</div>
                            <div class="text-light small">${product.unidad_medida || 'pz'}</div>
                        </div>
                        <button class="btn-add-cart mt-3 add-to-cart-btn" data-id="${product.id}">
                            <i class="fa-solid fa-cart-plus"></i> Agregar
                        </button>
                    </div>
                </div>
            `;
        });
        this.productList.innerHTML = html;
    }

    /**
     * Actualiza la interfaz del carrito (sidebar y contador)
     */
    renderCart(cart, total) {
        this.cartCount.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
        this.cartTotal.innerText = `$${total.toFixed(2)}`;

        if (cart.length === 0) {
            this.cartItemsContainer.innerHTML = `
                <div class="text-center py-5 opacity-50">
                    <i class="fa-solid fa-cart-arrow-down fs-1 mb-3"></i>
                    <p>Tu carrito está vacío</p>
                </div>
            `;
            return;
        }

        let html = '';
        cart.forEach(item => {
            html += `
                <div class="cart-item">
                    <img src="${item.imagen}" alt="${item.nombre}" class="cart-item-img">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.nombre}</div>
                        <div class="cart-item-price">$${parseFloat(item.precio).toFixed(2)}</div>
                        <div class="quantity-control">
                            <button class="qty-btn minus" data-id="${item.id}"><i class="fa-solid fa-minus"></i></button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn plus" data-id="${item.id}"><i class="fa-solid fa-plus"></i></button>
                            <button class="btn btn-link text-danger ms-auto p-0 remove-item" data-id="${item.id}">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        this.cartItemsContainer.innerHTML = html;
    }

    toggleCart(show) {
        if (show) {
            this.cartDrawer.classList.add('active');
            this.cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            this.cartDrawer.classList.remove('active');
            this.cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    showSuccess(title, text) {
        Swal.fire({
            icon: 'success',
            title,
            text,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: 'rgba(15, 23, 42, 0.9)',
            color: '#fff'
        });
    }

    showError(title, text) {
        Swal.fire({
            icon: 'error',
            title,
            text,
            confirmButtonColor: 'var(--primary-color)'
        });
    }

    updateAuthUI(user) {
        const userNavItem = document.getElementById('user-nav-item');
        if (user) {
            userNavItem.innerHTML = `
                <div class="dropdown">
                    <button class="btn btn-outline-light dropdown-toggle border-0 d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
                        <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 35px; height: 35px;">
                            ${user.nombre.charAt(0)}
                        </div>
                        <span class="d-none d-md-inline">${user.nombre}</span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark">
                        <li><a class="dropdown-item" href="#"><i class="fa-solid fa-clock-rotate-left me-2"></i> Mis Pedidos</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="#" id="logout-btn"><i class="fa-solid fa-right-from-bracket me-2"></i> Cerrar Sesión</a></li>
                    </ul>
                </div>
            `;
        } else {
            userNavItem.innerHTML = `
                <button class="btn-add-cart px-4" data-bs-toggle="modal" data-bs-target="#loginModal">
                    <i class="fa-solid fa-user me-2"></i> Iniciar Sesión
                </button>
            `;
        }
    }
}
