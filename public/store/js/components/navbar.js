/**
 * navbar.js
 */
class NavbarComponent {
    constructor() {
        this.render();
        this.setupListeners();
    }

    render() {
        const sesion = JSON.parse(localStorage.getItem('expendio_sesion'));
        const carrito = JSON.parse(localStorage.getItem('expendio_carrito')) || [];
        const count = carrito.reduce((acc, item) => acc + item.cantidad, 0);

        const navbarHTML = `
            <nav class="main-navbar">
                <div class="container navbar-content">
                    <a href="/store/index.html" class="logo-container">
                        <i class="fa-solid fa-bottle-water me-2"></i> EXPENDIO
                    </a>

                    <div class="search-bar-container d-none d-md-block" style="position:relative;">
                        <i class="fa-solid fa-magnifying-glass search-icon"></i>
                        <input type="text" class="search-input" id="global-search" 
                               placeholder="Buscar refrescos, cervezas, vinos..." autocomplete="off">
                        <div id="search-dropdown" style="
                            display:none; position:absolute; top:calc(100% + 8px); left:0; right:0;
                            background:rgba(15,23,42,0.98); border:1px solid rgba(255,255,255,0.15);
                            border-radius:16px; overflow:hidden; z-index:1200;
                            backdrop-filter:blur(20px); box-shadow:0 20px 40px rgba(0,0,0,0.5);">
                        </div>
                    </div>

                    <div class="nav-actions">
                        <button class="nav-btn d-md-none mobile-search-btn" id="btn-toggle-search">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </button>

                        <a href="/store/catalogo.html" class="nav-btn d-none d-md-block" title="Catálogo">
                            <i class="fa-solid fa-store"></i>
                        </a>
                        
                        <a href="javascript:void(0)" class="nav-btn" id="navbar-cart-btn" title="Carrito">
                            <i class="fa-solid fa-cart-shopping"></i>
                            <span class="cart-badge" id="navbar-cart-count">${count}</span>
                        </a>

                        ${sesion ? `
                            <div class="dropdown">
                                <button class="nav-btn dropdown-toggle" data-bs-toggle="dropdown">
                                    <i class="fa-solid fa-circle-user"></i>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark glass-dropdown">
                                    <li><span class="dropdown-item-text text-info small">Hola, ${sesion.nombre}</span></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li><a class="dropdown-item" href="/store/perfil.html">Mi Perfil</a></li>
                                    <li><a class="dropdown-item text-danger" href="#" id="btn-logout">Cerrar Sesión</a></li>
                                </ul>
                            </div>
                        ` : `
                            <a href="/store/login.html" class="nav-btn" title="Iniciar Sesión">
                                <i class="fa-solid fa-user"></i>
                            </a>
                        `}
                    </div>
                </div>
            </nav>

            <div class="mobile-search-bar" id="mobile-search-bar">
                <div class="position-relative">
                    <i class="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-3 opacity-50"></i>
                    <input type="text" class="form-control bg-dark border-secondary text-white rounded-pill ps-5" 
                           id="mobile-search-input" placeholder="Buscar productos...">
                </div>
            </div>

            <div class="cart-drawer-overlay" id="cart-drawer-overlay"></div>
            <div class="cart-drawer" id="cart-drawer">
                <div class="cart-drawer-header">
                <h5 class="m-0 fw-bold">
                    <i class="fa-solid fa-cart-shopping me-2 text-info"></i>
                    Tu Carrito <span class="badge bg-danger rounded-pill ms-2" id="drawer-count">0</span>
                </h5>
                <button class="btn-close-drawer" id="btn-close-drawer">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                </div>
                <div class="cart-drawer-body" id="drawer-items">
                <!-- items dinámicos -->
                </div>
                <div class="cart-drawer-footer">
                <div class="d-flex justify-content-between mb-3 opacity-75">
                    <span>Subtotal</span>
                    <span class="fw-bold" id="drawer-subtotal">$0.00</span>
                </div>
                <a href="/store/checkout.html" class="btn-add py-3 mb-2 d-block text-center text-decoration-none">
                    PROCEDER AL PAGO <i class="fa-solid fa-credit-card ms-2"></i>
                </a>
                <button class="btn btn-outline-light w-100 rounded-pill py-2 opacity-50" id="btn-keep-shopping">
                    Seguir comprando
                </button>
                </div>
            </div>
        `;

        const header = document.createElement('header');
        header.innerHTML = navbarHTML;
        document.body.prepend(header);

        // Definir funciones globales para el drawer
        window.abrirCartDrawer = function() {
            const carrito = JSON.parse(localStorage.getItem('expendio_carrito')) || [];
            const count = carrito.reduce((a, i) => a + i.cantidad, 0);
            const subtotal = carrito.reduce((a, i) => a + (i.precio * i.cantidad), 0);
            
            document.getElementById('drawer-count').innerText = count;
            document.getElementById('drawer-subtotal').innerText = `$${subtotal.toFixed(2)}`;
            
            const itemsEl = document.getElementById('drawer-items');
            if (carrito.length === 0) {
                itemsEl.innerHTML = `
                    <div class="text-center py-5 opacity-50">
                        <i class="fa-solid fa-cart-shopping fs-1 mb-3"></i>
                        <p>Tu carrito está vacío</p>
                    </div>`;
            } else {
                itemsEl.innerHTML = carrito.map(item => `
                    <div class="drawer-item slideUp">
                        <img src="${item.imagen}" alt="${item.nombre}">
                        <div class="flex-grow-1">
                            <div class="small fw-bold text-truncate" style="max-width:180px">${item.nombre}</div>
                            <div class="small opacity-50">${item.marca}</div>
                            <div class="small fw-bold text-info mt-1">
                                ${item.cantidad}x $${item.precio.toFixed(2)}
                            </div>
                        </div>
                        <div class="fw-bold">$${(item.precio * item.cantidad).toFixed(2)}</div>
                    </div>
                `).join('');
            }
            
            document.getElementById('cart-drawer').classList.add('open');
            document.getElementById('cart-drawer-overlay').classList.add('open');
        };

        window.cerrarCartDrawer = function() {
            document.getElementById('cart-drawer').classList.remove('open');
            document.getElementById('cart-drawer-overlay').classList.remove('open');
        };
    }

    setupListeners() {
        // Drawer listeners
        document.getElementById('navbar-cart-btn').addEventListener('click', window.abrirCartDrawer);
        document.getElementById('btn-close-drawer').addEventListener('click', window.cerrarCartDrawer);
        document.getElementById('cart-drawer-overlay').addEventListener('click', window.cerrarCartDrawer);
        document.getElementById('btn-keep-shopping').addEventListener('click', window.cerrarCartDrawer);

        // Actualizar badge del carrito
        window.addEventListener('carrito-actualizado', (e) => {
            const count = e.detail.reduce((acc, item) => acc + item.cantidad, 0);
            const badge = document.getElementById('navbar-cart-count');
            if (badge) badge.innerText = count;
            // Si el drawer está abierto, se actualizaría al abrirse de nuevo, o podemos refrescarlo aquí
            if (document.getElementById('cart-drawer').classList.contains('open')) {
                window.abrirCartDrawer();
            }
        });

        // Logout
        const logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('expendio_sesion');
                window.location.href = '/store/index.html';
            });
        }

        // Búsqueda Autocomplete
        let searchTimeout = null;
        const searchInput = document.getElementById('global-search');
        const dropdown = document.getElementById('search-dropdown');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const q = e.target.value.trim();
                if (q.length < 2) { dropdown.style.display = 'none'; return; }
                
                searchTimeout = setTimeout(async () => {
                    try {
                        const res = await fetch(`/api/productos/buscar?q=${encodeURIComponent(q)}`);
                        const productos = await res.json();
                        const top5 = productos.slice(0, 5);
                        
                        if (top5.length === 0) {
                            dropdown.innerHTML = `<div style="padding:16px;color:rgba(255,255,255,0.5);text-align:center;font-size:14px;">Sin resultados para "${q}"</div>`;
                        } else {
                            dropdown.innerHTML = top5.map(p => `
                                <a href="/store/producto.html?id=${p.id}" style="
                                    display:flex; align-items:center; gap:12px; padding:12px 16px;
                                    text-decoration:none; color:#fff; border-bottom:1px solid rgba(255,255,255,0.05);
                                    transition:background 0.2s;">
                                    <img src="${p.imagen || 'https://images.unsplash.com/photo-1544145945-f904253d0c71?auto=format&fit=crop&q=80&w=60'}" 
                                         style="width:40px;height:40px;object-fit:cover;border-radius:8px;">
                                    <div>
                                        <div style="font-weight:600;font-size:14px;">${p.nombre}</div>
                                        <div style="font-size:12px;color:#10B981;">${p.marca} · $${parseFloat(p.precio).toFixed(2)}</div>
                                    </div>
                                </a>
                            `).join('') + `
                                <a href="/store/catalogo.html?q=${encodeURIComponent(q)}" style="
                                    display:block; padding:12px 16px; text-align:center;
                                    color:#818CF8; font-size:13px; text-decoration:none;
                                    background:rgba(79,70,229,0.1);">
                                    Ver todos los resultados para "${q}" →
                                </a>`;
                        }
                        dropdown.style.display = 'block';
                    } catch(e) { dropdown.style.display = 'none'; }
                }, 300);
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.search-bar-container')) {
                    dropdown.style.display = 'none';
                }
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && searchInput.value.trim()) {
                    dropdown.style.display = 'none';
                    window.location.href = `/store/catalogo.html?q=${encodeURIComponent(searchInput.value)}`;
                }
            });
        }

        // Mobile Search Toggle
        const btnToggleSearch = document.getElementById('btn-toggle-search');
        const mobileSearchBar = document.getElementById('mobile-search-bar');
        if (btnToggleSearch) {
            btnToggleSearch.addEventListener('click', () => {
                const isOpen = mobileSearchBar.style.display === 'block';
                mobileSearchBar.style.display = isOpen ? 'none' : 'block';
                if (!isOpen) document.getElementById('mobile-search-input').focus();
            });
        }

        const mobileSearchInput = document.getElementById('mobile-search-input');
        if (mobileSearchInput) {
            mobileSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && mobileSearchInput.value.trim()) {
                    window.location.href = `/store/catalogo.html?q=${encodeURIComponent(mobileSearchInput.value)}`;
                }
            });
        }

        // Botón volver arriba
        const topBtn = document.createElement('button');
        topBtn.className = 'back-to-top';
        topBtn.id = 'back-to-top';
        topBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        topBtn.setAttribute('title', 'Volver arriba');
        document.body.appendChild(topBtn);

        topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        window.addEventListener('scroll', () => {
            topBtn.classList.toggle('visible', window.scrollY > 400);
        });
    }

}

// Iniciar navbar al cargar el script
document.addEventListener('DOMContentLoaded', () => new NavbarComponent());
