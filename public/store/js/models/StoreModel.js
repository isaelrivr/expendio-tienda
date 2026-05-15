/**
 * StoreModel.js
 * Maneja la lógica de datos, peticiones API y persistencia local.
 */
class StoreModel {
    constructor() {
        this.products = [];
        this.cart = JSON.parse(localStorage.getItem('expendio_cart')) || [];
        this.categories = [];
        this.user = JSON.parse(localStorage.getItem('expendio_user')) || null;
    }

    /**
     * Obtiene todos los productos activos del backend
     */
    async fetchProducts() {
        try {
            const response = await fetch('/api/productos');
            const data = await response.json();
            // Filtrar solo activos (aunque la API ya debería hacerlo)
            this.products = data.filter(p => p.activo === 1 || p.activo === true);
            this.extractCategories();
            return this.products;
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    }

    /**
     * Extrae categorías únicas de la lista de productos
     */
    extractCategories() {
        const cats = this.products.map(p => p.categoria);
        this.categories = [...new Set(cats)].filter(c => c);
    }

    /**
     * Agrega un producto al carrito
     */
    addToCart(productId, quantity = 1) {
        const product = this.products.find(p => p.id == productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id == productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: product.id,
                nombre: product.nombre,
                precio: product.precio,
                imagen: product.imagen || 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=300&h=300', // Fallback
                brand: product.marca,
                quantity: quantity
            });
        }

        this.saveCart();
        return this.cart;
    }

    /**
     * Actualiza la cantidad de un item en el carrito
     */
    updateCartQuantity(productId, delta) {
        const item = this.cart.find(i => i.id == productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            }
        }
        this.saveCart();
    }

    /**
     * Elimina un item del carrito
     */
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id != productId);
        this.saveCart();
    }

    /**
     * Guarda el carrito en LocalStorage
     */
    saveCart() {
        localStorage.setItem('expendio_cart', JSON.stringify(this.cart));
    }

    /**
     * Calcula el total del carrito
     */
    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
    }

    /**
     * Limpia el carrito
     */
    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    /**
     * Simulación de Login (se conectaría a POST /api/login si existiera)
     * Por ahora usamos los datos de clientes existentes
     */
    async login(email, password) {
        try {
            const response = await fetch('/api/clientes');
            const clientes = await response.json();
            const searchEmail = email.trim().toLowerCase();
            const cliente = clientes.find(c => c.email && c.email.trim().toLowerCase() === searchEmail);
            
            if (cliente) {
                this.user = cliente;
                localStorage.setItem('expendio_user', JSON.stringify(cliente));
                return { success: true, user: cliente };
            }
            return { success: false, message: "Usuario no encontrado" };
        } catch (error) {
            return { success: false, message: "Error de conexión" };
        }
    }

    logout() {
        this.user = null;
        localStorage.removeItem('expendio_user');
    }

    /**
     * Crea una venta en el backend
     */
    async createSale() {
        if (!this.user) throw new Error("Debes iniciar sesión para comprar");
        if (this.cart.length === 0) throw new Error("El carrito está vacío");

        const saleData = {
            sucursal_id: 1, // Por defecto
            empleado_id: 1, // Por defecto para tienda online
            cliente_id: this.user.id,
            metodo_pago: 'Efectivo', // O Tarjeta
            subtotal: this.getCartTotal() / 1.16,
            descuento: 0,
            impuesto: this.getCartTotal() * 0.16,
            total: this.getCartTotal(),
            estatus: 'Pendiente'
        };

        try {
            const response = await fetch('/api/ventas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(saleData)
            });
            const sale = await response.json();

            // Agregar detalles
            for (const item of this.cart) {
                await fetch('/api/detalle_venta', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        venta_id: sale.id,
                        producto_id: item.id,
                        cantidad: item.quantity,
                        precio_unitario: item.precio,
                        descuento: 0,
                        impuesto: item.precio * 0.16,
                        subtotal: item.precio * item.quantity
                    })
                });
            }

            this.clearCart();
            return sale;
        } catch (error) {
            console.error("Error creating sale:", error);
            throw error;
        }
    }
}
