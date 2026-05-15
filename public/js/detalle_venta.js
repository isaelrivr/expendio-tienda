// public/js/detalle_venta.js

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const ventaId = urlParams.get('id');

    if (!ventaId) {
        Swal.fire('Error', 'No se especificó la venta', 'error').then(() => {
            window.location.href = 'ventas.html';
        });
        return;
    }

    document.getElementById('venta_id').value = ventaId;

    const form = document.getElementById('formDetalle');
    const tableBody = document.getElementById('tableBody');
    const productoSelect = document.getElementById('producto_id');
    const cantidadInput = document.getElementById('cantidad');
    const precioInput = document.getElementById('precio_unitario');

    let productosData = [];

    // Cargar información general de la venta
    const loadVentaInfo = async () => {
        try {
            const res = await fetch(`/api/ventas/${ventaId}`);
            if(!res.ok) throw new Error("No se encontró la venta");
            const venta = await res.json();
            
            document.getElementById('info-folio').textContent = venta.folio || 'N/A';
            // Dependiendo del backend, la venta podría no venir con el nombre del cliente si es getById
            // Pero asumiendo que el getById también devuelva o hagamos fetch extra, lo dejamos así:
            document.getElementById('info-cliente').textContent = venta.cliente_id ? `ID Cliente: ${venta.cliente_id}` : 'Desconocido';
            
            const fecha = venta.fecha_venta ? String(venta.fecha_venta).split('T')[0] : 'N/A';
            document.getElementById('info-fecha').textContent = fecha;
            
            const formatter = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });
            document.getElementById('info-total').textContent = formatter.format(venta.total || 0);

        } catch (e) {
            console.error(e);
            showAlert('error', 'Error', 'No se pudo cargar la información de la venta.');
        }
    };

    // Cargar lista de productos para el select
    const loadProductos = async () => {
        try {
            const res = await fetch('/api/productos');
            productosData = await res.json();
            
            productoSelect.innerHTML = '<option value="">Seleccione un producto</option>';
            productosData.forEach(p => {
                if(p.activo !== 0 && p.activo !== false && p.activo !== "0") {
                    productoSelect.innerHTML += `<option value="${p.id}" data-precio="${p.precio}">${p.codigo_barras || ''} - ${p.nombre}</option>`;
                }
            });
        } catch (e) {
            console.error(e);
        }
    };

    // Al cambiar el producto, auto-llenar el precio
    productoSelect.addEventListener('change', (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        if (selectedOption && selectedOption.value !== "") {
            const precio = selectedOption.getAttribute('data-precio');
            precioInput.value = parseFloat(precio || 0).toFixed(2);
        } else {
            precioInput.value = "";
        }
    });

    // Cargar los detalles existentes
    const loadDetalles = async () => {
        try {
            toggleLoading('tableBody', true);
            const res = await fetch(`/api/detalle_venta/venta/${ventaId}`);
            const detalles = await res.json();
            renderTable(detalles);
        } catch (e) {
            console.error(e);
            renderEmptyState('tableBody', 6, 'Error al cargar los detalles');
        } finally {
            toggleLoading('tableBody', false);
        }
    };

    const renderTable = (data) => {
        if (!data || data.length === 0) {
            renderEmptyState('tableBody', 6, 'No hay productos en esta venta');
            return;
        }

        let rows = '';
        const formatter = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

        data.forEach(item => {
            const sub = parseFloat(item.cantidad) * parseFloat(item.precio_unitario);
            rows += `
                <tr>
                    <td>${item.codigo_barras || '-'}</td>
                    <td>${item.producto_nombre || `Prod ID: ${item.producto_id}`}</td>
                    <td class="text-center">${item.cantidad}</td>
                    <td class="text-end">${formatter.format(item.precio_unitario)}</td>
                    <td class="text-end fw-bold">${formatter.format(sub)}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-danger btn-delete" data-id="${item.id}" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = rows;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validación básica
        if (!productoSelect.value || !cantidadInput.value || !precioInput.value) {
            showAlert('warning', 'Validación', 'Por favor complete todos los campos');
            return;
        }

        const obj = {
            venta_id: ventaId,
            producto_id: productoSelect.value,
            cantidad: cantidadInput.value,
            precio_unitario: precioInput.value,
            descuento: 0,
            impuesto: (parseFloat(cantidadInput.value) * parseFloat(precioInput.value)) * 0.16 // asumiendo 16% iva
        };

        try {
            const res = await fetch('/api/detalle_venta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(obj)
            });

            if (res.ok) {
                form.reset();
                cantidadInput.value = 1;
                await loadDetalles();
                await loadVentaInfo(); // Recargar la cabecera para ver el nuevo total
                Swal.fire({
                    icon: 'success', title: 'Agregado', text: 'Producto agregado a la venta.', timer: 1500, showConfirmButton: false
                });
            } else {
                const err = await res.json();
                showAlert('error', 'Error', err.message || 'No se pudo agregar');
            }
        } catch (error) {
            console.error(error);
            showAlert('error', 'Error de Conexión', 'No se pudo comunicar con el servidor');
        }
    });

    tableBody.addEventListener('click', async (e) => {
        const deleteBtn = e.target.closest('.btn-delete');
        if (deleteBtn) {
            const id = deleteBtn.getAttribute('data-id');
            const result = await confirmDelete("¿Quitar producto?", "El producto será removido de esta venta");
            
            if (result) {
                try {
                    const res = await fetch(`/api/detalle_venta/${id}`, { method: 'DELETE' });
                    if (res.ok) {
                        await loadDetalles();
                        await loadVentaInfo();
                        Swal.fire('Eliminado', 'Producto quitado de la venta', 'success');
                    } else {
                        showAlert('error', 'Error', 'No se pudo eliminar el detalle');
                    }
                } catch (err) {
                    showAlert('error', 'Error', 'Problema de red al eliminar');
                }
            }
        }
    });

    // Iniciar
    const init = async () => {
        await loadVentaInfo();
        await loadProductos();
        await loadDetalles();
    };
    
    init();
});
