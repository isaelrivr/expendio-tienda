/**
 * PerfilController.js
 */
class PerfilController {
    constructor() {
        this.clienteModel = new ClienteModel();
        this.init();
    }

    async init() {
        if (!this.clienteModel.isLoggedIn()) {
            window.location.href = '/store/login.html';
            return;
        }

        const sesion = this.clienteModel.getSesion();
        this.renderDatos(sesion);
        await this.loadPedidos(sesion.id);
        this.setupListeners();
    }

    renderDatos(sesion) {
        document.getElementById('profile-name').innerText = `${sesion.nombre} ${sesion.apellido_paterno}`;
        document.getElementById('profile-points').innerText = sesion.puntos || 0;
        
        document.getElementById('data-full-name').innerText = `${sesion.nombre} ${sesion.apellido_paterno} ${sesion.apellido_materno || ''}`;
        document.getElementById('data-email').innerText = sesion.email;
        document.getElementById('data-phone').innerText = sesion.telefono;
        document.getElementById('data-city').innerText = sesion.ciudad || 'No especificada';
    }

    async loadPedidos(clienteId) {
        try {
            const pedidos = await this.clienteModel.getPedidos(clienteId);
            const list = document.getElementById('pedidos-list');
            const empty = document.getElementById('pedidos-empty');

            if (!pedidos || pedidos.length === 0) {
                empty.classList.remove('d-none');
                return;
            }

            list.innerHTML = pedidos.map(p => {
                const estatusClass = {
                    'Pendiente': 'bg-warning',
                    'En proceso': 'bg-info',
                    'Enviado': 'bg-primary',
                    'Entregado': 'bg-success',
                    'Cancelado': 'bg-danger'
                }[p.estatus] || 'bg-secondary';

                return `
                    <tr class="fadeIn">
                        <td><span class="fw-bold text-info">${p.folio}</span></td>
                        <td>${new Date(p.fecha_venta).toLocaleDateString()}</td>
                        <td>$${parseFloat(p.total).toFixed(2)}</td>
                        <td>${p.metodo_pago}</td>
                        <td><span class="badge ${estatusClass} rounded-pill">${p.estatus}</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline-light opacity-50" disabled>
                                <i class="fa-solid fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        } catch (error) {
            console.error(error);
            Toast.show('Error al cargar pedidos', 'error');
        }
    }

    setupListeners() {
        document.getElementById('btn-logout-profile').addEventListener('click', () => {
            this.clienteModel.cerrarSesion();
            window.location.href = '/store/index.html';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new PerfilController());
