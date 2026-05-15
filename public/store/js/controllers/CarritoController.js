/**
 * CarritoController.js
 */
class CarritoController {
    constructor() {
        this.carritoModel = new CarritoModel();
        this.init();
    }

    init() {
        this.render();
        this.setupListeners();
    }

    render() {
        const list = document.getElementById('cart-list');
        const content = document.getElementById('cart-content');
        const empty = document.getElementById('cart-empty');

        if (this.carritoModel.items.length === 0) {
            content.classList.add('d-none');
            empty.classList.remove('d-none');
            return;
        }

        content.classList.remove('d-none');
        empty.classList.add('d-none');

        list.innerHTML = this.carritoModel.items.map(item => `
            <div class="product-card mb-3 p-3">
                <div class="row align-items-center g-3">
                    <div class="col-md-2 col-4">
                        <img src="${item.imagen}" class="img-fluid rounded-3" alt="${item.nombre}">
                    </div>
                    <div class="col-md-4 col-8">
                        <div class="small text-secondary">${item.marca}</div>
                        <h5 class="m-0">${item.nombre}</h5>
                        <div class="fw-bold text-info mt-1">$${item.precio.toFixed(2)}</div>
                    </div>
                    <div class="col-md-3 col-6">
                        <div class="d-flex align-items-center gap-2">
                            <button class="qty-btn btn-sm btn-update" data-id="${item.id}" data-delta="-1"><i class="fa-solid fa-minus"></i></button>
                            <span class="fw-bold px-2">${item.cantidad}</span>
                            <button class="qty-btn btn-sm btn-update" data-id="${item.id}" data-delta="1"><i class="fa-solid fa-plus"></i></button>
                        </div>
                    </div>
                    <div class="col-md-2 col-4 text-end">
                        <div class="fw-bold fs-5">$${(item.precio * item.cantidad).toFixed(2)}</div>
                    </div>
                    <div class="col-md-1 col-2 text-end">
                        <button class="btn btn-link text-danger btn-eliminar" data-id="${item.id}">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        this.updateSummary();
    }

    updateSummary() {
        document.getElementById('summary-subtotal').innerText = `$${this.carritoModel.calcularSubtotal().toFixed(2)}`;
        document.getElementById('summary-iva').innerText = `$${this.carritoModel.calcularIVA().toFixed(2)}`;
        document.getElementById('summary-total').innerText = `$${this.carritoModel.calcularTotal().toFixed(2)}`;
    }

    setupListeners() {
        document.addEventListener('click', (e) => {
            const updateBtn = e.target.closest('.btn-update');
            if (updateBtn) {
                const id = parseInt(updateBtn.dataset.id);
                const delta = parseInt(updateBtn.dataset.delta);
                const item = this.carritoModel.items.find(i => i.id === id);
                if (item) {
                    this.carritoModel.actualizarCantidad(id, item.cantidad + delta);
                    this.render();
                }
            }

            const deleteBtn = e.target.closest('.btn-eliminar');
            if (deleteBtn) {
                const id = parseInt(deleteBtn.dataset.id);
                this.carritoModel.eliminar(id);
                this.render();
                Toast.show('Producto eliminado', 'info');
            }

            if (e.target.id === 'btn-to-checkout') {
                window.location.href = '/store/checkout.html';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new CarritoController());
