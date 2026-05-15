// public/js/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    cargarResumenDashboard();
});

async function cargarResumenDashboard() {
    try {
        const response = await fetch('/api/dashboard/resumen');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Formatear a moneda para ventas
        const formatter = new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        });

        // Actualizar el DOM
        document.getElementById('kpi-ventas').textContent = formatter.format(data.ventasDia || 0);
        document.getElementById('kpi-clientes').textContent = data.totalClientes || 0;
        document.getElementById('kpi-stock').textContent = data.productosBajoStock || 0;
        document.getElementById('kpi-sucursales').textContent = data.sucursalesActivas || 0;

        // Añadir clases si hay bajo stock (alerta visual)
        if (data.productosBajoStock > 0) {
            document.getElementById('kpi-stock').parentElement.parentElement.classList.add('border', 'border-danger');
        }

    } catch (error) {
        console.error('Error cargando el dashboard:', error);
        
        const errorHtml = '<i class="fa-solid fa-triangle-exclamation text-warning fs-4" title="Error de conexión"></i>';
        document.getElementById('kpi-ventas').innerHTML = errorHtml;
        document.getElementById('kpi-clientes').innerHTML = errorHtml;
        document.getElementById('kpi-stock').innerHTML = errorHtml;
        document.getElementById('kpi-sucursales').innerHTML = errorHtml;
        
        showAlert('error', 'Error', 'No se pudo cargar la información del dashboard.');
    }
}
