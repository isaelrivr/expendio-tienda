/**
 * StoreController.js
 * Orquestador principal. Conecta el Modelo con la Vista.
 */
class StoreController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Inicializar
        this.init();
    }

    async init() {
        this.view.updateAuthUI(this.model.user);
        this.view.renderCart(this.model.cart, this.model.getCartTotal());

        await this.loadProducts();
        this.setupEventListeners();
    }

    async loadProducts() {
        const products = await this.model.fetchProducts();
        this.view.renderCategories(this.model.categories);
        this.view.renderProducts(products);
    }

    setupEventListeners() {
        // --- Filtrado y Búsqueda ---
        this.view.categoryContainer.addEventListener('click', (e) => {
            const pill = e.target.closest('.category-pill');
            if (!pill) return;

            e.preventDefault();
            
            // UI Update
            document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const category = pill.dataset.category;
            this.filterProducts(category, document.getElementById('search-input').value);
        });

        document.getElementById('search-input').addEventListener('input', (e) => {
            const searchTerm = e.target.value;
            const activeCategory = document.querySelector('.category-pill.active').dataset.category;
            this.filterProducts(activeCategory, searchTerm);
        });

        // --- Carrito ---
        document.getElementById('cart-toggle').addEventListener('click', () => this.view.toggleCart(true));
        document.getElementById('cart-close').addEventListener('click', () => this.view.toggleCart(false));
        document.getElementById('cart-overlay').addEventListener('click', () => this.view.toggleCart(false));

        // Event delegation para botones de "Agregar al carrito"
        this.view.productList.addEventListener('click', (e) => {
            const btn = e.target.closest('.add-to-cart-btn');
            if (btn) {
                const productId = btn.dataset.id;
                this.model.addToCart(productId);
                this.view.renderCart(this.model.cart, this.model.getCartTotal());
                this.view.showSuccess('¡Agregado!', 'Producto añadido al carrito');
            }
        });

        // Event delegation para controles del carrito
        this.view.cartItemsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const productId = btn.dataset.id;

            if (btn.classList.contains('plus')) {
                this.model.updateCartQuantity(productId, 1);
            } else if (btn.classList.contains('minus')) {
                this.model.updateCartQuantity(productId, -1);
            } else if (btn.classList.contains('remove-item')) {
                this.model.removeFromCart(productId);
            }

            this.view.renderCart(this.model.cart, this.model.getCartTotal());
        });

        // --- Autenticación ---
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = loginForm.querySelector('input[type="email"]').value;
                const password = loginForm.querySelector('input[type="password"]').value;

                const result = await this.model.login(email, password);
                if (result.success) {
                    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
                    this.view.updateAuthUI(result.user);
                    this.view.showSuccess('Bienvenido', `Hola, ${result.user.nombre}`);
                } else {
                    this.view.showError('Error', result.message);
                }
            });
        }

        // Logout (usando delegación de eventos porque el botón es dinámico)
        document.body.addEventListener('click', (e) => {
            if (e.target.closest('#logout-btn')) {
                e.preventDefault();
                this.model.logout();
                this.view.updateAuthUI(null);
                this.view.showSuccess('Adiós', 'Sesión cerrada correctamente');
            }
        });

        // --- Checkout ---
        document.getElementById('btn-checkout').addEventListener('click', async () => {
            if (!this.model.user) {
                this.view.toggleCart(false);
                new bootstrap.Modal(document.getElementById('loginModal')).show();
                return;
            }

            if (this.model.cart.length === 0) {
                this.view.showError('Carrito Vacío', 'Agrega algunos productos antes de continuar.');
                return;
            }

            try {
                this.view.toggleCart(false);
                Swal.fire({
                    title: 'Procesando Compra...',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading(),
                    background: 'rgba(15, 23, 42, 0.9)',
                    color: '#fff'
                });

                const sale = await this.model.createSale();
                
                Swal.fire({
                    icon: 'success',
                    title: '¡Compra Exitosa!',
                    text: `Tu pedido #${sale.id} ha sido registrado.`,
                    confirmButtonColor: 'var(--secondary-color)',
                    background: 'rgba(15, 23, 42, 0.9)',
                    color: '#fff'
                });

                this.view.renderCart(this.model.cart, this.model.getCartTotal());
            } catch (error) {
                this.view.showError('Error', error.message);
            }
        });
    }

    filterProducts(category, searchTerm) {
        let filtered = this.model.products;

        if (category !== 'all') {
            filtered = filtered.filter(p => p.category === category || p.categoria === category);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(p => 
                p.nombre.toLowerCase().includes(term) || 
                (p.marca && p.marca.toLowerCase().includes(term))
            );
        }

        this.view.renderProducts(filtered);
    }
}
