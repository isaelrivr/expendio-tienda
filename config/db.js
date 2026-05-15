// Importa la librería mysql2 para conectarse a bases de datos MySQL
const mysql = require('mysql2');

// Crea un pool (conjunto) de conexiones a la base de datos
// Un pool reutiliza conexiones para mejorar el rendimiento
const pool = mysql.createPool({
  // Host donde está la base de datos (servidor)
  host: process.env.DB_HOST || 'localhost',
  
  // Usuario de la base de datos
  user: process.env.DB_USER || 'root',
  
  // Contraseña del usuario
  password: process.env.DB_PASSWORD || 'rootpassword',
  
  // Nombre de la base de datos
  database: process.env.DB_NAME || 'expendio_bebidas',
  
  // Espera si no hay conexión disponible
  waitForConnections: true,
  
  // Máximo de conexiones simultáneas
  connectionLimit: 10,
  
  // Máximo de solicitudes en cola
  queueLimit: 0,
  
  // Soporte para caracteres especiales (UTF-8)
  charset: 'utf8mb4'
});

// Exporta el pool con promesas (para usar async/await)
module.exports = pool.promise();