// Carga las variables de entorno del archivo .env
require('dotenv').config();

// Importa Express (framework para crear servidores web)
const express = require('express');

// Importa CORS (permite que frontend y backend se comuniquen)
const cors = require('cors');

// Crea la aplicación Express
const app = express();

// Define el puerto (toma el valor de .env o usa 3000 por defecto)
const PORT = process.env.PORT || 3000;

// MIDDLEWARES (funciones que procesan cada petición)
// Permite peticiones desde otros orígenes
app.use(cors());
app.use(express.json());

// Sirve archivos estáticos de la carpeta 'public' (HTML, CSS, JS)
app.use(express.static('public'));

// RUTAS DE LA API (cada ruta apunta a un controlador)
// Las rutas para gestionar clientes
app.use('/api/clientes', require('./routes/clientesRoutes'));

// Rutas de Autenticación de Clientes
app.use('/api/auth', require('./routes/authRoutes'));

// Las rutas para gestionar sucursales
app.use('/api/sucursales', require('./routes/sucursalesRoutes'));
app.use('/api/empleados', require('./routes/empleadosRoutes'));

// Las rutas para gestionar proveedores
app.use('/api/proveedores', require('./routes/proveedoresRoutes'));

// Las rutas para gestionar productos
app.use('/api/productos', require('./routes/productosRoutes'));

// Las rutas para gestionar ventas
app.use('/api/ventas', require('./routes/ventasRoutes'));

// Rutas de Detalle de Venta
app.use('/api/detalle_venta', require('./routes/detalleVentaRoutes'));

// Rutas del Dashboard
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Ruta para la tienda online (Frontend Público)
app.get('/store', (req, res) => {
  res.sendFile(__dirname + '/public/store/index.html');
});

// Inicia el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
