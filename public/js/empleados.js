// SCRIPT DE EMPLEADOS
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formempleados');
  const tableBody = document.getElementById('tableBody');
  const btnCancel = document.getElementById('btnCancel');
  const idInput = document.getElementById('id');
  const fechaIngresoInput = document.getElementById('fecha_ingreso');
  const sucursalSelect = document.getElementById('sucursal_id');
  
  let isEditing = false;
  let allData = [];
  let sucursalesMap = {}; // Para mostrar nombre en lugar de ID

  // Función para rellenar la fecha de hoy por defecto
  const setTodayDate = () => {
    const today = new Date().toISOString().split('T')[0];
    fechaIngresoInput.value = today;
  };

  const loadSucursales = async () => {
    try {
      const res = await fetch('/api/sucursales');
      const sucursales = await res.json();
      
      sucursalSelect.innerHTML = '<option value="">Seleccione una sucursal</option>';
      sucursales.forEach(s => {
        sucursalesMap[s.id] = s.nombre;
        sucursalSelect.innerHTML += `<option value="${s.id}">${s.nombre}</option>`;
      });
    } catch (e) {
      console.error('Error cargando sucursales:', e);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch('/api/empleados');
      allData = await res.json();
      renderTable(allData);
    } catch (e) { console.error(e); }
  };

  const renderTable = (data) => {
    let rows = '';
    data.forEach(item => {
      const statusBadge = item.estatus === 'Activo' 
        ? '<span class="badge bg-success">Activo</span>' 
        : '<span class="badge bg-secondary">Baja</span>';
        
      const sucursalNombre = sucursalesMap[item.sucursal_id] || `ID: ${item.sucursal_id}`;
      const nombreCompleto = `${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`;
      const salarioFormat = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.salario);

      rows += `
        <tr>
          <td class="fw-bold">${nombreCompleto}</td>
          <td>${sucursalNombre}</td>
          <td>${item.puesto}</td>
          <td>${item.turno}</td>
          <td>${salarioFormat}</td>
          <td>${statusBadge}</td>
          <td class="text-center">
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
    
    let recordId = document.getElementById('id').value;
    if (!isEditing) {
       const maxId = allData.length > 0 ? Math.max(...allData.map(d => parseInt(d.id) || 0)) : 0;
       recordId = maxId + 1;
    }

    const obj = {
      id: recordId,
      sucursal_id: document.getElementById('sucursal_id').value,
      nombre: document.getElementById('nombre').value,
      apellido_paterno: document.getElementById('apellido_paterno').value,
      apellido_materno: document.getElementById('apellido_materno').value,
      puesto: document.getElementById('puesto').value,
      telefono: document.getElementById('telefono').value,
      email: document.getElementById('email').value,
      fecha_ingreso: document.getElementById('fecha_ingreso').value,
      salario: document.getElementById('salario').value,
      turno: document.getElementById('turno').value,
      estatus: document.getElementById('estatus').value
    };
    
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/empleados/${obj.id}` : '/api/empleados';
    
    try {
      const response = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(obj) });
      if(response.ok) {
        Swal.fire({
          icon: 'success',
          title: isEditing ? 'Actualizado' : 'Guardado',
          text: 'El empleado se ha guardado correctamente.',
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
    if(item.nombre !== null) document.getElementById('nombre').value = item.nombre;
    if(item.apellido_paterno !== null) document.getElementById('apellido_paterno').value = item.apellido_paterno;
    if(item.apellido_materno !== null) document.getElementById('apellido_materno').value = item.apellido_materno;
    if(item.puesto !== null) document.getElementById('puesto').value = item.puesto;
    if(item.telefono !== null) document.getElementById('telefono').value = item.telefono;
    if(item.email !== null) document.getElementById('email').value = item.email;
    if(item.fecha_ingreso !== null) document.getElementById('fecha_ingreso').value = String(item.fecha_ingreso).split('T')[0];
    if(item.salario !== null) document.getElementById('salario').value = item.salario;
    if(item.turno !== null) document.getElementById('turno').value = item.turno;
    if(item.estatus !== null) document.getElementById('estatus').value = item.estatus;
    
    btnCancel.classList.remove('d-none');
    document.getElementById('formTitle').innerHTML = '<i class="fa-solid fa-pen me-2"></i>Editar Registro';
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
        const res = await fetch(`/api/empleados/${id}`, { method: 'DELETE' });
        if(!res.ok) {
           const errorData = await res.json();
           Swal.fire('Error', 'No se pudo eliminar: ' + (errorData.message || 'Error del servidor'), 'error');
        } else {
           Swal.fire('Eliminado!', 'El empleado ha sido eliminado.', 'success');
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
    document.getElementById('formTitle').innerHTML = '<i class="fa-solid fa-plus-circle me-2"></i>Agregar Empleado';
    setTodayDate();
  };

  btnCancel.addEventListener('click', resetForm);
  
  // Init
  const init = async () => {
    await loadSucursales();
    setTodayDate();
    fetchData();
  };
  init();
});