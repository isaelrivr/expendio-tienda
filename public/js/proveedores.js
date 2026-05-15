// SCRIPT DE PROVEEDORES
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formproveedores');
  const tableBody = document.getElementById('tableBody');
  const btnCancel = document.getElementById('btnCancel');
  const idInput = document.getElementById('id');
  
  let isEditing = false;
  let allData = [];

  const fetchData = async () => {
    try {
      const res = await fetch('/api/proveedores');
      allData = await res.json();
      renderTable(allData);
    } catch (e) { console.error(e); }
  };

  const renderTable = (data) => {
    let rows = '';
    data.forEach(item => {
      const statusBadge = item.estatus === 'Activo' 
        ? '<span class="badge bg-success">Activo</span>' 
        : '<span class="badge bg-danger">Suspendido</span>';

      rows += `
        <tr>
          <td class="fw-bold">${item.nombre_comercial}</td>
          <td>${item.contacto_nombre}</td>
          <td>${item.telefono}</td>
          <td>${item.dias_credito} días</td>
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
      nombre_comercial: document.getElementById('nombre_comercial').value,
      contacto_nombre: document.getElementById('contacto_nombre').value,
      telefono: document.getElementById('telefono').value,
      email: document.getElementById('email').value,
      calle: document.getElementById('calle').value,
      numero: document.getElementById('numero').value,
      colonia: document.getElementById('colonia').value,
      ciudad: document.getElementById('ciudad').value,
      rfc: document.getElementById('rfc').value,
      dias_credito: document.getElementById('dias_credito').value,
      estatus: document.getElementById('estatus').value
    };
    
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/proveedores/${obj.id}` : '/api/proveedores';
    
    try {
      const response = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(obj) });
      if(response.ok) {
        Swal.fire({
          icon: 'success',
          title: isEditing ? 'Actualizado' : 'Guardado',
          text: 'El proveedor se ha guardado correctamente.',
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
    if(item.nombre_comercial !== null) document.getElementById('nombre_comercial').value = item.nombre_comercial;
    if(item.contacto_nombre !== null) document.getElementById('contacto_nombre').value = item.contacto_nombre;
    if(item.telefono !== null) document.getElementById('telefono').value = item.telefono;
    if(item.email !== null) document.getElementById('email').value = item.email;
    if(item.calle !== null) document.getElementById('calle').value = item.calle;
    if(item.numero !== null) document.getElementById('numero').value = item.numero;
    if(item.colonia !== null) document.getElementById('colonia').value = item.colonia;
    if(item.ciudad !== null) document.getElementById('ciudad').value = item.ciudad;
    if(item.rfc !== null) document.getElementById('rfc').value = item.rfc;
    if(item.dias_credito !== null) document.getElementById('dias_credito').value = item.dias_credito;
    if(item.estatus !== null) document.getElementById('estatus').value = item.estatus;
    
    btnCancel.classList.remove('d-none');
    document.getElementById('formTitle').innerHTML = '<i class="fa-solid fa-pen me-2"></i>Editar Proveedor';
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
        const res = await fetch(`/api/proveedores/${id}`, { method: 'DELETE' });
        if(!res.ok) {
           const errorData = await res.json();
           Swal.fire('Error', 'No se pudo eliminar: ' + (errorData.message || 'Error del servidor'), 'error');
        } else {
           Swal.fire('Eliminado!', 'El proveedor ha sido eliminado.', 'success');
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
    document.getElementById('formTitle').innerHTML = '<i class="fa-solid fa-plus-circle me-2"></i>Agregar Proveedor';
  };

  btnCancel.addEventListener('click', resetForm);
  
  // Init
  fetchData();
});