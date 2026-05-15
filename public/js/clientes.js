// SCRIPT DE CLIENTES
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formclientes');
  const tableBody = document.getElementById('tableBody');
  const btnCancel = document.getElementById('btnCancel');
  const idInput = document.getElementById('id');
  const fechaRegistroInput = document.getElementById('fecha_registro');
  const puntosInput = document.getElementById('puntos');
  
  let isEditing = false;
  let allData = [];

  const setDefaults = () => {
    const today = new Date().toISOString().split('T')[0];
    fechaRegistroInput.value = today;
    puntosInput.value = 0;
  };

  const fetchData = async () => {
    try {
      const res = await fetch('/api/clientes');
      allData = await res.json();
      renderTable(allData);
    } catch (e) { console.error(e); }
  };

  const renderTable = (data) => {
    let rows = '';
    data.forEach(item => {
      const nombreCompleto = `${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`;
      const badgePuntos = item.puntos > 500 
        ? `<span class="badge bg-warning text-dark"><i class="fa-solid fa-star me-1"></i>${item.puntos}</span>`
        : `<span class="badge bg-secondary">${item.puntos}</span>`;

      rows += `
        <tr>
          <td class="fw-bold">${nombreCompleto}</td>
          <td>${item.telefono}</td>
          <td>${item.email}</td>
          <td>${item.ciudad}</td>
          <td>${badgePuntos}</td>
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
      nombre: document.getElementById('nombre').value,
      apellido_paterno: document.getElementById('apellido_paterno').value,
      apellido_materno: document.getElementById('apellido_materno').value,
      telefono: document.getElementById('telefono').value,
      email: document.getElementById('email').value,
      calle: document.getElementById('calle').value,
      numero: document.getElementById('numero').value,
      colonia: document.getElementById('colonia').value,
      ciudad: document.getElementById('ciudad').value,
      fecha_registro: document.getElementById('fecha_registro').value,
      puntos: document.getElementById('puntos').value
    };
    
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/clientes/${obj.id}` : '/api/clientes';
    
    try {
      const response = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(obj) });
      if(response.ok) {
        Swal.fire({
          icon: 'success',
          title: isEditing ? 'Actualizado' : 'Guardado',
          text: 'El cliente se ha guardado correctamente.',
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
    if(item.nombre !== null) document.getElementById('nombre').value = item.nombre;
    if(item.apellido_paterno !== null) document.getElementById('apellido_paterno').value = item.apellido_paterno;
    if(item.apellido_materno !== null) document.getElementById('apellido_materno').value = item.apellido_materno;
    if(item.telefono !== null) document.getElementById('telefono').value = item.telefono;
    if(item.email !== null) document.getElementById('email').value = item.email;
    if(item.calle !== null) document.getElementById('calle').value = item.calle;
    if(item.numero !== null) document.getElementById('numero').value = item.numero;
    if(item.colonia !== null) document.getElementById('colonia').value = item.colonia;
    if(item.ciudad !== null) document.getElementById('ciudad').value = item.ciudad;
    if(item.fecha_registro !== null) document.getElementById('fecha_registro').value = String(item.fecha_registro).split('T')[0];
    if(item.puntos !== null) document.getElementById('puntos').value = item.puntos;
    
    btnCancel.classList.remove('d-none');
    document.getElementById('formTitle').innerHTML = '<i class="fa-solid fa-pen me-2"></i>Editar Cliente';
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
        const res = await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
        if(!res.ok) {
           const errorData = await res.json();
           Swal.fire('Error', 'No se pudo eliminar: ' + (errorData.message || 'Error del servidor'), 'error');
        } else {
           Swal.fire('Eliminado!', 'El cliente ha sido eliminado.', 'success');
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
    document.getElementById('formTitle').innerHTML = '<i class="fa-solid fa-plus-circle me-2"></i>Agregar Cliente';
    setDefaults();
  };

  btnCancel.addEventListener('click', resetForm);
  
  // Init
  setDefaults();
  fetchData();
});