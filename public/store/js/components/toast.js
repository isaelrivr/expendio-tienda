/**
 * toast.js
 */
const Toast = {
    show(mensaje, tipo = 'success') {
        const container = this.getContainer();
        
        const icons = {
            success: 'fa-circle-check',
            error: 'fa-circle-xmark',
            info: 'fa-circle-info',
            warning: 'fa-triangle-exclamation'
        };

        const colors = {
            success: 'var(--secondary-color)',
            error: 'var(--danger-color)',
            info: 'var(--primary-color)',
            warning: 'var(--warning-color)'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${tipo}`;
        toast.style.borderLeft = `5px solid ${colors[tipo]}`;
        
        toast.innerHTML = `
            <i class="fa-solid ${icons[tipo]}" style="color: ${colors[tipo]}; font-size: 1.2rem;"></i>
            <span>${mensaje}</span>
        `;

        container.appendChild(toast);

        // Auto-dismiss
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    getContainer() {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }
};

// CSS adicional para la animación de salida
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
