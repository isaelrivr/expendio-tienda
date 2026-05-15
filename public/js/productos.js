// SCRIPT DE PRODUCTOS
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formproductos');
  const tableBody = document.getElementById('tableBody');
  const btnCancel = document.getElementById('btnCancel');
  const idInput = document.getElementById('id');
  const fechaCaducidadInput = document.getElementById('fecha_caducidad');
  const proveedorSelect = document.getElementById('proveedor_id');
  
  let isEditing = false;
  let allData = [];
  let proveedoresMap = {};

  const setDefaults = () => {
    // Por defecto caducidad a 6 meses
    const date = new Date();
    date.setMonth(date.getMonth() + 6);
    fechaCaducidadInput.value = date.toISOString().split('T')[0];
  };

  const loadProveedores = async () => {
    try {
      const res = await fetch('/api/proveedores');
      const proveedores = await res.json();
      
      proveedorSelect.innerHTML = '<option value="">Seleccione un proveedor</option>';
      proveedores.forEach(p => {
        proveedoresMap[p.id] = p.nombre_comercial;
        proveedorSelect.innerHTML += `<option value="${p.id}">${p.nombre_comercial}</option>`;
      });
    } catch (e) {
      console.error('Error cargando proveedores:', e);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch('/api/productos');
      allData = await res.json();
      renderTable(allData);
    } catch (e) { console.error(e); }
  };

  const renderTable = (data) => {
    let rows = '';
    data.forEach(item => {
      const provName = proveedoresMap[item.proveedor_id] || `ID: ${item.proveedor_id}`;
      const precioFormat = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.precio);
      
      let stockBadge = '';
      if (item.stock <= item.stock_minimo) {
        stockBadge = `<span class="badge bg-danger">${item.stock} (Bajo)</span>`;
      } else {
        stockBadge = `<span class="badge bg-success">${item.stock}</span>`;
      }

      const statusBadge = item.activo == 1 
        ? '<span class="badge bg-success">Activo</span>' 
        : '<span class="badge bg-secondary">Inactivo</span>';

      rows += `
        <tr>
          <td class="fw-bold">${item.nombre} <br><small class="text-muted">${item.codigo_barras}</small></td>
          <td>${provName}</td>
          <td>${item.categoria}</td>
          <td>${precioFormat}</td>
          <td>${stockBadge}</td>
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
      proveedor_id: document.getElementById('proveedor_id').value,
      categoria: document.getElementById('categoria').value,
      codigo_barras: document.getElementById('codigo_barras').value,
      nombre: document.getElementById('nombre').value,
      descripcion: document.getElementById('descripcion').value,
      marca: document.getElementById('marca').value,
      unidad_medida: document.getElementById('unidad_medida').value,
      costo: document.getElementById('costo').value,
      precio: document.getElementById('precio').value,
      stock: document.getElementById('stock').value,
      stock_minimo: document.getElementById('stock_minimo').value,
      fecha_caducidad: document.getElementById('fecha_caducidad').value,
      activo: document.getElementById('activo').value,
      imagen: document.getElementById('imagen').value
    };

    // Subir imagen si hay un archivo seleccionado
    const fileInput = document.getElementById('foto_file');
    if (fileInput.files.length > 0) {
      const formData = new FormData();
      formData.append('foto', fileInput.files[0]);
      
      try {
        const uploadRes = await fetch('/api/productos/upload', {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
          obj.imagen = uploadData.url;
        } else {
          throw new Error(uploadData.message || 'Error al subir imagen');
        }
      } catch (err) {
        Swal.fire('Error', 'No se pudo subir la imagen: ' + err.message, 'error');
        return;
      }
    }
    
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/productos/${obj.id}` : '/api/productos';
    
    try {
      const response = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(obj) });
      if(response.ok) {
        Swal.fire({
          icon: 'success',
          title: isEditing ? 'Actualizado' : 'Guardado',
          text: 'El producto se ha guardado correctamente.',
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
    if(item.proveedor_id !== null) document.getElementById('proveedor_id').value = item.proveedor_id;
    if(item.categoria !== null) document.getElementById('categoria').value = item.categoria;
    if(item.codigo_barras !== null) document.getElementById('codigo_barras').value = item.codigo_barras;
    if(item.nombre !== null) document.getElementById('nombre').value = item.nombre;
    if(item.descripcion !== null) document.getElementById('descripcion').value = item.descripcion;
    if(item.marca !== null) document.getElementById('marca').value = item.marca;
    if(item.unidad_medida !== null) document.getElementById('unidad_medida').value = item.unidad_medida;
    if(item.costo !== null) document.getElementById('costo').value = item.costo;
    if(item.precio !== null) document.getElementById('precio').value = item.precio;
    if(item.stock !== null) document.getElementById('stock').value = item.stock;
    if(item.stock_minimo !== null) document.getElementById('stock_minimo').value = item.stock_minimo;
    if(item.fecha_caducidad !== null) document.getElementById('fecha_caducidad').value = String(item.fecha_caducidad).split('T')[0];
    if(item.activo !== null) document.getElementById('activo').value = item.activo;
    if(item.imagen !== null) {
        document.getElementById('imagen').value = item.imagen;
        const preview = document.getElementById('image-preview');
        preview.src = item.imagen;
        document.getElementById('image-preview-container').classList.remove('d-none');
    } else {
        document.getElementById('imagen').value = '';
        document.getElementById('image-preview-container').classList.add('d-none');
    }
    
    btnCancel.classList.remove('d-none');
    document.getElementById('formTitle').innerHTML = '<i class="fa-solid fa-pen me-2"></i>Editar Producto';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Preview de imagen al seleccionar archivo
  document.getElementById('foto_file').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const preview = document.getElementById('image-preview');
        preview.src = e.target.result;
        document.getElementById('image-preview-container').classList.remove('d-none');
      }
      reader.readAsDataURL(file);
    }
  });

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
        const res = await fetch(`/api/productos/${id}`, { method: 'DELETE' });
        if(!res.ok) {
           const errorData = await res.json();
           Swal.fire('Error', 'No se pudo eliminar: ' + (errorData.message || 'Error del servidor'), 'error');
        } else {
           Swal.fire('Eliminado!', 'El producto ha sido eliminado.', 'success');
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
    document.getElementById('imagen').value = '';
    document.getElementById('image-preview-container').classList.add('d-none');
    document.getElementById('foto_file').value = '';
    btnCancel.classList.add('d-none');
    document.getElementById('formTitle').innerHTML = '<i class="fa-solid fa-plus-circle me-2"></i>Agregar Producto';
    setDefaults();
  };

  btnCancel.addEventListener('click', resetForm);
  
  // Init
  const init = async () => {
    await loadProveedores();
    setDefaults();
    fetchData();
  };
  init();
});