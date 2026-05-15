// public/js/utils.js

/**
 * Muestra u oculta un estado de carga en un contenedor
 * @param {string} containerId - ID del contenedor (ej. tabla)
 * @param {boolean} isLoading - True para mostrar, False para ocultar
 */
function toggleLoading(containerId, isLoading) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (isLoading) {
        // Añadir spinner si no existe
        if (!document.getElementById(`spinner-${containerId}`)) {
            const spinnerHTML = `
                <div id="spinner-${containerId}" class="d-flex justify-content-center align-items-center py-5" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); z-index:10;">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                </div>
            `;
            container.style.position = 'relative';
            container.style.opacity = '0.5';
            container.insertAdjacentHTML('beforeend', spinnerHTML);
        }
    } else {
        // Quitar spinner
        const spinner = document.getElementById(`spinner-${containerId}`);
        if (spinner) {
            spinner.remove();
        }
        container.style.opacity = '1';
    }
}

/**
 * Renderiza una fila de estado vacío en una tabla
 * @param {string} tbodyId - ID del tbody
 * @param {number} colspan - Número de columnas para expandir
 * @param {string} message - Mensaje a mostrar
 */
function renderEmptyState(tbodyId, colspan, message = "No hay registros disponibles") {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = `
        <tr>
            <td colspan="${colspan}" class="text-center py-4 text-muted">
                <i class="fa-solid fa-folder-open mb-2 fs-3"></i><br>
                ${message}
            </td>
        </tr>
    `;
}

/**
 * Resalta el enlace activo en la barra de navegación basado en la URL
 */
function highlightActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
            link.style.color = 'var(--secondary-color)';
            link.style.fontWeight = '700';
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Confirmación universal para borrar usando SweetAlert2
 * @param {string} title 
 * @param {string} text 
 * @returns {Promise<boolean>}
 */
async function confirmDelete(title = "¿Estás seguro?", text = "Esta acción no se puede deshacer.") {
    const result = await Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'var(--danger-color)',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });
    return result.isConfirmed;
}

/**
 * Muestra una alerta de éxito o error con SweetAlert2
 */
function showAlert(type, title, text) {
    Swal.fire({
        icon: type, // 'success', 'error', 'warning', 'info'
        title: title,
        text: text,
        confirmButtonColor: 'var(--primary-color)'
    });
}

// Ejecutar al cargar cualquier página
document.addEventListener('DOMContentLoaded', () => {
    highlightActiveNavLink();
});
