/**
 * CarritoModel.js
 */
class CarritoModel {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('expendio_carrito')) || [];
    }

    agregar(producto, cantidad = 1) {
        const itemExistente = this.items.find(i => i.id === producto.id);
        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            this.items.push({
                id: producto.id,
                nombre: producto.nombre,
                marca: producto.marca,
                precio: parseFloat(producto.precio),
                imagen: producto.imagen || 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=300',
                cantidad: cantidad
            });
        }
        this.guardar();
        this.notificar();
    }

    eliminar(productoId) {
        this.items = this.items.filter(i => i.id !== productoId);
        this.guardar();
        this.notificar();
    }

    actualizarCantidad(productoId, cantidad) {
        const item = this.items.find(i => i.id === productoId);
        if (item) {
            item.cantidad = Math.max(1, cantidad);
            this.guardar();
            this.notificar();
        }
    }

    calcularSubtotal() {
        return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    calcularIVA() {
        return this.calcularSubtotal() * 0.16;
    }

    calcularTotal(descuento = 0) {
        return (this.calcularSubtotal() + this.calcularIVA()) - descuento;
    }

    vaciar() {
        this.items = [];
        this.guardar();
        this.notificar();
    }

    guardar() {
        localStorage.setItem('expendio_carrito', JSON.stringify(this.items));
    }

    notificar() {
        // Evento personalizado para actualizar la UI (Navbar badge)
        window.dispatchEvent(new CustomEvent('carrito-actualizado', { detail: this.items }));
    }

    getItemsCount() {
        return this.items.reduce((acc, item) => acc + item.cantidad, 0);
    }
}
