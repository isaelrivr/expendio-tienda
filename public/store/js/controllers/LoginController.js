/**
 * LoginController.js
 */
class LoginController {
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
        const form = document.getElementById('login-form-page');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = document.getElementById('btn-login-submit');
                const email = form.email.value;
                const password = form.password.value;

                try {
                    btn.disabled = true;
                    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
                    
                    await this.clienteModel.login(email, password);
                    Toast.show('¡Bienvenido!', 'success');
                    
                    setTimeout(() => window.location.href = '/store/index.html', 1000);
                } catch (error) {
                    Toast.show(error.message, 'error');
                    btn.disabled = false;
                    btn.innerHTML = 'ENTRAR <i class="fa-solid fa-right-to-bracket ms-2"></i>';
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new LoginController());
