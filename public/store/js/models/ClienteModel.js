/**
 * ClienteModel.js
 */
class ClienteModel {
    constructor() {
        this.sessionKey = 'expendio_sesion';
    }

    async login(email, password) {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            this.setSesion(data);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async registrar(data) {
        try {
            const res = await fetch('/api/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            // Auto-login después de registrar
            return await this.login(data.email, data.password || '123456');
        } catch (error) {
            throw error;
        }
    }

    async getPerfil(id) {
        try {
            const res = await fetch(`/api/auth/perfil/${id}`);
            return await res.json();
        } catch (error) {
            throw error;
        }
    }

    async getPedidos(clienteId) {
        try {
            const res = await fetch(`/api/ventas/cliente/${clienteId}`);
            return await res.json();
        } catch (error) {
            throw error;
        }
    }

    getSesion() {
        return JSON.parse(localStorage.getItem(this.sessionKey));
    }

    setSesion(data) {
        localStorage.setItem(this.sessionKey, JSON.stringify(data));
        window.dispatchEvent(new CustomEvent('sesion-cambiada', { detail: data }));
    }

    cerrarSesion() {
        localStorage.removeItem(this.sessionKey);
        window.dispatchEvent(new CustomEvent('sesion-cambiada', { detail: null }));
    }

    isLoggedIn() {
        return !!this.getSesion();
    }
}
