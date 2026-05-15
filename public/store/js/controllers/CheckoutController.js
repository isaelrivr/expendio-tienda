/**
 * CheckoutController.js
 * Capa de Controlador (C en MVC) para la página de checkout.
 * - Orquesta: eventos de usuario → Model (datos) → View (render)
 * - NO manipula innerHTML directamente (eso es de CheckoutView)
 * - VentaModel recibe datos planos, no el objeto carritoModel
 */
class CheckoutController {
    constructor() {
        this.carritoModel = new CarritoModel();
        this.clienteModel = new ClienteModel();
        this.ventaModel = new VentaModel();
        this.view = new CheckoutView();

        this.currentStep = 1;
        this.init();
    }

    init() {
        // Redirigir si el carrito está vacío
        if (this.carritoModel.items.length === 0) {
            window.location.href = '/store/carrito.html';
            return;
        }

        // View: renderiza el resumen usando datos del Model
        this.view.renderSummary(
            this.carritoModel.items,
            this.carritoModel.calcularSubtotal(),
            this.carritoModel.calcularIVA(),
            this.carritoModel.calcularTotal(),
            this.carritoModel.getItemsCount()
        );

        this.verificarAuth();
        this.setupListeners();
    }

    verificarAuth() {
        const sesion = this.clienteModel.getSesion();
        if (sesion) {
            // View: prellenar formulario con datos del cliente
            this.view.rellenarFormCliente(sesion);
        }
    }

    setupListeners() {
        // Navegación entre pasos
        document.getElementById('next-to-2')?.addEventListener('click', () => {
            if (!this.clienteModel.isLoggedIn()) {
                Toast.show('Inicia sesión para continuar con tu compra', 'warning');
                setTimeout(() => window.location.href = '/store/login.html', 1800);
                return;
            }
            this.view.irAPaso(this.currentStep, 2);
            this.currentStep = 2;
        });

        document.getElementById('next-to-3')?.addEventListener('click', () => {
            this.view.irAPaso(this.currentStep, 3);
            this.currentStep = 3;
        });

        document.getElementById('back-to-1')?.addEventListener('click', () => {
            this.view.irAPaso(this.currentStep, 1);
            this.currentStep = 1;
        });

        document.getElementById('back-to-2')?.addEventListener('click', () => {
            this.view.irAPaso(this.currentStep, 2);
            this.currentStep = 2;
        });

        // Selección visual de método de pago
        document.querySelectorAll('.payment-method').forEach(method => {
            method.addEventListener('click', () => {
                document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
                method.classList.add('active');
                method.querySelector('input').checked = true;
            });
        });

        // Finalizar compra
        document.getElementById('btn-finalizar')?.addEventListener('click', () => this.finalizarCompra());
    }

    async finalizarCompra() {
        try {
            // View: cambiar estado del botón
            this.view.actualizarBtnFinalizar('loading');

            const sesion = this.clienteModel.getSesion();
            if (!sesion) {
                Toast.show('Por favor inicia sesión para finalizar', 'warning');
                setTimeout(() => window.location.href = '/store/login.html', 2000);
                return;
            }

            const metodoPago = document.querySelector('input[name="pago"]:checked')?.value || 'Efectivo';

            // Extraer datos planos del carrito — NO pasar el objeto carritoModel al VentaModel
            const itemsPlanos = this.carritoModel.items.map(item => ({
                id: item.id,
                nombre: item.nombre,
                precio: item.precio,
                cantidad: item.cantidad
            }));

            // Model: procesar la orden con datos planos
            const result = await this.ventaModel.procesarOrdenCompleta(
                sesion,
                itemsPlanos,
                this.carritoModel.calcularSubtotal(),
                this.carritoModel.calcularIVA(),
                this.carritoModel.calcularTotal(),
                metodoPago
            );

            if (result.success) {
                // Guardar resumen en sessionStorage antes de vaciar
                sessionStorage.setItem('ultimo_pedido', JSON.stringify({
                    folio: result.folio,
                    items: this.carritoModel.items,
                    total: this.carritoModel.calcularTotal(),
                    subtotal: this.carritoModel.calcularSubtotal(),
                    iva: this.carritoModel.calcularIVA()
                }));

                this.carritoModel.vaciar();
                window.location.href = `/store/confirmacion.html?folio=${result.folio}`;
            }
        } catch (error) {
            console.error(error);
            Toast.show('Error al procesar la compra', 'error');
            this.view.actualizarBtnFinalizar('idle');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new CheckoutController());
