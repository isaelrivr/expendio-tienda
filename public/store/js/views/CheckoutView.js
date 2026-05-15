/**
 * views/CheckoutView.js
 * Capa de Vista (V en MVC) para la página de checkout.
 * - Responsable ÚNICAMENTE de manipular el DOM
 * - NO hace fetch() ni lógica de negocio
 * - Recibe datos del Controller y los renderiza
 */
class CheckoutView {

    /**
     * Renderiza el resumen de la orden en el sidebar del checkout
     * @param {Array}  items    - Items del carrito [{ nombre, cantidad, precio }]
     * @param {number} subtotal
     * @param {number} iva
     * @param {number} total
     * @param {number} totalItems - Cantidad total de artículos
     */
    renderSummary(items, subtotal, iva, total, totalItems) {
        const list = document.getElementById('checkout-summary-list');
        if (list) {
            list.innerHTML = items.map(item => `
                <div class="d-flex justify-content-between mb-2 small">
                    <span class="opacity-75">${item.cantidad}x ${item.nombre}</span>
                    <span class="fw-bold">$${(parseFloat(item.precio) * item.cantidad).toFixed(2)}</span>
                </div>
            `).join('');
        }

        const totalEl = document.getElementById('checkout-total');
        if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;

        const confirmTotal = document.getElementById('confirm-total');
        if (confirmTotal) confirmTotal.innerText = `$${total.toFixed(2)}`;

        const confirmCount = document.getElementById('confirm-count');
        if (confirmCount) confirmCount.innerText = totalItems;
    }

    /**
     * Prelllena el formulario de envío con los datos del cliente
     * @param {Object} sesion - { nombre, apellido_paterno, email, telefono }
     */
    rellenarFormCliente(sesion) {
        const infoBox = document.getElementById('user-info-box');
        if (infoBox) infoBox.classList.remove('d-none');

        const nameEl = document.getElementById('logged-user-name');
        if (nameEl) nameEl.innerText = sesion.nombre;

        const form = document.getElementById('checkout-form');
        if (form) {
            if (form.nombre) form.nombre.value = sesion.nombre || '';
            if (form.apellidos) form.apellidos.value = sesion.apellido_paterno || '';
            if (form.email) form.email.value = sesion.email || '';
            if (form.telefono) form.telefono.value = sesion.telefono || '';
        }
    }

    /**
     * Navega entre los pasos del checkout
     * @param {number} stepActual - Paso actual
     * @param {number} stepNuevo  - Paso al que se va
     */
    irAPaso(stepActual, stepNuevo) {
        const actualEl = document.getElementById(`step-${stepActual}`);
        const actualHead = document.getElementById(`step-${stepActual}-head`);
        if (actualEl) actualEl.classList.add('d-none');
        if (actualHead) actualHead.classList.remove('active');

        const nuevoEl = document.getElementById(`step-${stepNuevo}`);
        const nuevoHead = document.getElementById(`step-${stepNuevo}-head`);
        if (nuevoEl) nuevoEl.classList.remove('d-none');
        if (nuevoHead) nuevoHead.classList.add('active');
    }

    /**
     * Cambia el estado del botón de finalizar compra
     * @param {'loading'|'idle'} estado
     */
    actualizarBtnFinalizar(estado) {
        const btn = document.getElementById('btn-finalizar');
        if (!btn) return;

        if (estado === 'loading') {
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> PROCESANDO...';
        } else {
            btn.disabled = false;
            btn.innerHTML = 'CONFIRMAR PEDIDO';
        }
    }
}
