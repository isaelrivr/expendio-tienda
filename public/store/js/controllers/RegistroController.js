/**
 * RegistroController.js
 */
class RegistroController {
    constructor() {
        this.clienteModel = new ClienteModel();
        this.init();
    }

    init() {
        if (this.clienteModel.isLoggedIn()) {
            window.location.href = '/store/index.html';
            return;
        }
        this.setupListeners();
    }

    setupListeners() {
        const form = document.getElementById('registro-form-page');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = document.getElementById('btn-registro-submit');
                
                const formData = {
                    nombre: form.nombre.value,
                    apellido_paterno: form.apellido_paterno.value,
                    apellido_materno: form.apellido_materno.value,
                    email: form.email.value,
                    password: form.password.value,
                    telefono: form.telefono.value,
                    calle: form.calle.value || 'Sin especificar',
                    numero: form.numero.value || 'S/N',
                    colonia: form.colonia.value || 'Sin especificar',
                    ciudad: form.ciudad.value,
                    fecha_registro: new Date().toISOString().slice(0, 10),
                    puntos: 0
                };

                try {
                    btn.disabled = true;
                    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> REGISTRANDO...';
                    
                    await this.clienteModel.registrar(formData);
                    Toast.show('¡Registro exitoso!', 'success');
                    
                    setTimeout(() => window.location.href = '/store/index.html', 1500);
                } catch (error) {
                    Toast.show(error.message, 'error');
                    btn.disabled = false;
                    btn.innerHTML = 'CREAR CUENTA <i class="fa-solid fa-user-plus ms-2"></i>';
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new RegistroController());
