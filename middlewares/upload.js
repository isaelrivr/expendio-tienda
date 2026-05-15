/**
 * middlewares/upload.js
 * Middleware de Multer para manejo de subida de archivos.
 * Centraliza la configuración de almacenamiento para mantener
 * las rutas (Routes) limpias de lógica de negocio.
 */
const multer = require('multer');
const path = require('path');

// Configuración del almacenamiento en disco
const storage = multer.diskStorage({
  // Define el directorio destino de las imágenes
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/productos/');
  },
  // Genera un nombre de archivo único para evitar colisiones
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'prod-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'), false);
  }
};

// Límite de tamaño: 5MB
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;
