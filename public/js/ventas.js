// SCRIPT DE VENTAS
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formventas');
  const tableBody = document.getElementById('tableBody');
  const btnCancel = document.getElementById('btnCancel');
  
  const subtotalInput = document.getElementById('subtotal');
  const descuentoInput = document.getElementById('descuento');
  const impuestoInput = document.getElementById('impuesto');
  const totalInput = document.getElementById('total');
  const folioDisplay = document.getElementById('folioDisplay');
  const folioInput = document.getElementById('folio');
  const fechaVentaInput = document.getElementById('fecha_venta');

  let isEditing = false;
  let allData = [];
  
  // Maps para nombres
  let sucursalesMap = {};
  let empleadosMap = {};
  let clientesMap = {};

  const setDefaults = () => {
    // Fecha actual
    const today = new Date().toISOString().split('T')[0];
    fechaVentaInput.value = today;
    
    // Auto generar folio
    if (!isEditing) {
      const nextId = allData.length > 0 ? Math.max(...allData.map(d => parseInt(d.id) || 0)) + 1 : 1;
      const genFolio = `EXPE-${String(nextId).padStart(5, '0')}`;
      folioInput.value = genFolio;
      folioDisplay.innerHTML = `<i class="fa-solid fa-hashtag me-1"></i>${genFolio}`;
    }
    
    // Valores numéricos a 0
    if (!subtotalInput.value) subtotalInput.value = '0.00';
    if (!descuentoInput.value) descuentoInput.value = '0.00';
    calcularTotales();
  };

  const calcularTotales = () => {
    const sub = parseFloat(subtotalInput.value) || 0;
    const desc = parseFloat(descuentoInput.value) || 0;
    
    const imp = sub * 0.16; // 16% IVA
    const tot = sub - desc + imp;
    
    impuestoInput.value = imp.toFixed(2);
    totalInput.value = tot.toFixed(2);
  };

  // Eventos para calcular en tiempo real
  subtotalInput.addEventListener('input', calcularTotales);
  descuentoInput.addEventListener('input', calcularTotales);

  const loadRelacionales = async () => {
    try {
      // Cargar sucursales
      let res = await fetch('/api/sucursales');
      let data = await res.json();
      const selSuc = document.getElementById('sucursal_id');
      selSuc.innerHTML = '<option value="">Seleccione sucursal</option>';
      data.forEach(x => {
        sucursalesMap[x.id] = x.nombre;
        selSuc.innerHTML += `<option value="${x.id}">${x.nombre}</option>`;
      });

      // Cargar empleados
      res = await fetch('/api/empleados');
      data = await res.json();
      const selEmp = document.getElementById('empleado_id');
      selEmp.innerHTML = '<option value="">Seleccione empleado</option>';
      data.forEach(x => {
        const nom = `${x.nombre} ${x.apellido_paterno}`;
        empleadosMap[x.id] = nom;
        selEmp.innerHTML += `<option value="${x.id}">${nom}</option>`;
      });

      // Cargar clientes
      res = await fetch('/api/clientes');
      data = await res.json();
      const selCli = document.getElementById('cliente_id');
      selCli.innerHTML = '<option value="">Seleccione cliente</option>';
      data.forEach(x => {
        const nom = `${x.nombre} ${x.apellido_paterno}`;
        clientesMap[x.id] = nom;
        selCli.innerHTML += `<option value="${x.id}">${nom}</option>`;
      });
    } catch (e) {
      console.error('Error cargando listas relacionales', e);
    }
  };

  const fetchData = async () => {
    try {
      toggleLoading('tableBody', true);
      const res = await fetch('/api/ventas');
      allData = await res.json();
      setDefaults(); // Para actualizar el siguiente folio disponible
      renderTable(allData);
    } catch (e) { 
      console.error(e); 
      renderEmptyState('tableBody', 7, 'Error al cargar ventas');
    } finally {
      toggleLoading('tableBody', false);
    }
  };

  const renderTable = (data) => {
    let rows = '';
    
    if (data.length === 0) {
      renderEmptyState('tableBody', 7, 'No hay ventas registradas');
      return;
    }

    data.forEach(item => {
      // Usar los datos del JOIN si están presentes
      const nomCliente = item.cliente || clientesMap[item.cliente_id] || `ID: ${item.cliente_id}`;
      const nomSucursal = item.sucursal || sucursalesMap[item.sucursal_id] || `ID: ${item.sucursal_id}`;
      const totFormat = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.total);
      
      let estatusBadge = '';
      switch (item.estatus) {
        case 'Pagada': estatusBadge = '<span class="badge bg-success">Pagada</span>'; break;
        case 'Entregada': estatusBadge = '<span class="badge bg-info">Entregada</span>'; break;
        case 'Cancelada': estatusBadge = '<span class="badge bg-danger">Cancelada</span>'; break;
        default: estatusBadge = '<span class="badge bg-warning text-dark">En proceso</span>';
      }

      // Convertir fecha de ISO a local o corta
      let fecha = String(item.fecha_venta).split('T')[0];

      rows += `
        <tr>
          <td class="fw-bold">${item.folio}</td>
          <td>${fecha}</td>
          <td>${nomCliente}</td>
          <td>${nomSucursal}</td>
          <td class="fw-bold text-primary">${totFormat}</td>
          <td>${estatusBadge}</td>
          <td class="text-center">
            <button class="btn btn-sm btn-info me-1 btn-detalle" data-id="${item.id}" title="Ver Detalles"><i class="fa-solid fa-list text-white"></i></button>
            <button class="btn btn-sm btn-warning me-1 btn-edit" data-id="${item.id}" title="Editar"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-sm btn-danger btn-delete" data-id="${item.id}" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `;
    });
    tableBody.innerHTML = rows;
  };

  tableBody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.btn-edit');
    const deleteBtn = e.target.closest('.btn-delete');
    const detalleBtn = e.target.closest('.btn-detalle');
    
    if (detalleBtn) {
      window.location.href = `detalle_venta.html?id=${detalleBtn.getAttribute('data-id')}`;
    }
    
    if (editBtn) {
      const id = parseInt(editBtn.getAttribute('data-id'));
      const item = allData.find(d => d.id === id);
      if (item) editItem(item);
    }
    
    if (deleteBtn) {
      const id = parseInt(deleteBtn.getAttribute('data-id'));
      deleteItem(id);
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    calcularTotales();
    
    let recordId = document.getElementById('id').value;
    if (!isEditing) {
       const maxId = allData.length > 0 ? Math.max(...allData.map(d => parseInt(d.id) || 0)) : 0;
       recordId = maxId + 1;
    }

    const obj = {
      id: recordId,
      sucursal_id: document.getElementById('sucursal_id').value,
      empleado_id: document.getElementById('empleado_id').value,
      cliente_id: document.getElementById('cliente_id').value,
      folio: document.getElementById('folio').value,
      fecha_venta: document.getElementById('fecha_venta').value,
      metodo_pago: document.getElementById('metodo_pago').value,
      subtotal: parseFloat(document.getElementById('subtotal').value),
      descuento: parseFloat(document.getElementById('descuento').value),
      impuesto: parseFloat(document.getElementById('impuesto').value),
      total: parseFloat(document.getElementById('total').value),
      estatus: document.getElementById('estatus').value
    };
    
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/ventas/${obj.id}` : '/api/ventas';
    
    try {
      const response = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(obj) });
      if(response.ok) {
        Swal.fire({
          icon: 'success',
          title: isEditing ? 'Actualizado' : 'Guardado',
          text: 'La venta se ha guardado correctamente.',
          timer: 1500,
          showConfirmButton: false
        });
        resetForm();
        fetchData();
      } else {
        const errorData = await response.json();
        Swal.fire('Error', 'Error al guardar: ' + (errorData.message || 'Desconocido'), 'error');
      }
    } catch (e) { 
      console.error(e);
      Swal.fire('Error', 'Error de conexión al guardar.', 'error');
    }
  });

  const editItem = (item) => {
    isEditing = true;
    
    if(item.id !== null) document.getElementById('id').value = item.id;
    if(item.sucursal_id !== null) document.getElementById('sucursal_id').value = item.sucursal_id;
    if(item.empleado_id !== null) document.getElementById('empleado_id').value = item.empleado_id;
    if(item.cliente_id !== null) document.getElementById('cliente_id').value = item.cliente_id;
    if(item.folio !== null) {
      document.getElementById('folio').value = item.folio;
      folioDisplay.innerHTML = `<i class="fa-solid fa-hashtag me-1"></i>${item.folio}`;
    }
    if(item.fecha_venta !== null) document.getElementById('fecha_venta').value = String(item.fecha_venta).split('T')[0];
    if(item.metodo_pago !== null) document.getElementById('metodo_pago').value = item.metodo_pago;
    if(item.estatus !== null) document.getElementById('estatus').value = item.estatus;
    
    if(item.subtotal !== null) document.getElementById('subtotal').value = parseFloat(item.subtotal).toFixed(2);
    if(item.descuento !== null) document.getElementById('descuento').value = parseFloat(item.descuento).toFixed(2);
    
    calcularTotales();
    
    btnCancel.classList.remove('d-none');
    document.getElementById('formTitle').innerHTML = '<i class="fa-solid fa-pen me-2"></i>Editar Venta';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteItem = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if(result.isConfirmed) {
      try {
        const res = await fetch(`/api/ventas/${id}`, { method: 'DELETE' });
        if(!res.ok) {
           const errorData = await res.json();
           Swal.fire('Error', 'No se pudo eliminar: ' + (errorData.message || 'Error del servidor'), 'error');
        } else {
           Swal.fire('Eliminado!', 'La venta ha sido eliminada.', 'success');
           fetchData();
        }
      } catch(e) {
        Swal.fire('Error', 'Error de conexión al eliminar.', 'error');
      }
    }
  };

  const resetForm = () => {
    form.reset();
    isEditing = false;
    document.getElementById('id').value = '';
    btnCancel.classList.add('d-none');
    document.getElementById('formTitle').innerHTML = '<i class="fa-solid fa-plus-circle me-2"></i>Nueva Venta';
    setDefaults();
  };

  btnCancel.addEventListener('click', resetForm);
  
  // Init
  const init = async () => {
    await loadRelacionales();
    await fetchData(); // fetchData calls setDefaults inside
  };
  init();
});