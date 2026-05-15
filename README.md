# 🍺 ExpendioFS — Plataforma de E-Commerce y Gestión para Expendio de Bebidas

> Sistema Full-Stack completo con panel de administración ERP y tienda online al estilo Uber Eats / Rappi. Desarrollado bajo arquitectura **MVC estricta** con Node.js, Express, MySQL y JavaScript Vanilla.

---

## 🖥️ Demo Visual

| Panel Administrador | Tienda Online |
|---|---|
| Dashboard con KPIs en tiempo real | Hero section con CTA |
| CRUD completo de 6 entidades | Catálogo con filtros y búsqueda |
| Gestión de ventas y detalles | Carrito con mini-drawer lateral |
| Alertas de stock bajo | Checkout multi-paso |
| Subida de imágenes de productos | Pantalla de confirmación de pedido |

---

## ✅ Funcionalidades Implementadas

### 🔧 Panel de Administración (`/`)

| Módulo | Funcionalidades |
|---|---|
| **Dashboard** | KPIs: ventas del día, total de clientes, productos con stock bajo, sucursales activas |
| **Sucursales** | CRUD completo — nombre, dirección, teléfono, estado activo/inactivo |
| **Empleados** | CRUD completo — puesto, sucursal asignada, turno, salario, estatus |
| **Clientes** | CRUD completo — datos de contacto, dirección, puntos de lealtad, fecha de registro |
| **Proveedores** | CRUD completo — datos comerciales, RFC, días de crédito, estatus |
| **Productos** | CRUD completo — categoría, stock, precio, costo, caducidad, **subida de imagen** |
| **Ventas** | CRUD completo — folio, método de pago, detalles, estatus, historial |
| **Detalle de Venta** | CRUD completo — partidas por producto, cantidad, precio unitario, entregado |

### 🛒 Tienda Online (`/store/`)

| Página | Funcionalidades |
|---|---|
| **Inicio** (`index.html`) | Hero section, categorías horizontales, productos destacados dinámicos, CTA |
| **Catálogo** (`catalogo.html`) | Grid de productos, filtro por categoría, búsqueda en tiempo real, skeleton loaders, ordenamiento |
| **Detalle de Producto** (`producto.html`) | Imagen, precio, descripción, selector de cantidad, agregar al carrito, **"También te puede gustar"** |
| **Carrito** (`carrito.html`) | Lista editable de items, cálculo de subtotal/IVA/total, vaciar, ir a checkout |
| **Checkout** (`checkout.html`) | 3 pasos: datos del cliente → método de pago → confirmación; prellenado con datos de sesión |
| **Confirmación** (`confirmacion.html`) | Animación de éxito, folio de seguimiento, resumen del pedido |
| **Login** (`login.html`) | Autenticación por email/password contra API |
| **Registro** (`registro.html`) | Creación de cuenta de cliente, auto-login post-registro |
| **Perfil** (`perfil.html`) | Datos del cliente, puntos de lealtad, historial de pedidos con estatus |

### ⚙️ Backend — API REST

| Endpoint | Método | Descripción |
|---|---|---|
| `/api/auth/login` | `POST` | Autenticación de cliente |
| `/api/auth/perfil/:id` | `GET` | Perfil del cliente autenticado |
| `/api/clientes` | `GET/POST/PUT/DELETE` | CRUD completo de clientes |
| `/api/productos` | `GET/POST/PUT/DELETE` | CRUD completo de productos |
| `/api/productos/buscar?q=` | `GET` | Búsqueda por nombre o marca |
| `/api/productos/categoria/:cat` | `GET` | Filtrar por categoría |
| `/api/productos/upload` | `POST` | Subir imagen de producto (Multer) |
| `/api/ventas` | `GET/POST/PUT/DELETE` | CRUD completo de ventas |
| `/api/ventas/cliente/:id` | `GET` | Historial de pedidos del cliente |
| `/api/detalle_venta` | `GET/POST/PUT/DELETE` | CRUD de detalles de venta |
| `/api/sucursales` | `GET/POST/PUT/DELETE` | CRUD de sucursales |
| `/api/empleados` | `GET/POST/PUT/DELETE` | CRUD de empleados |
| `/api/proveedores` | `GET/POST/PUT/DELETE` | CRUD de proveedores |
| `/api/dashboard/resumen` | `GET` | KPIs del dashboard |

---

## 🏗️ Arquitectura MVC

El proyecto aplica **MVC estricto** en ambas capas:

### Backend (Node.js)
```
Petición HTTP
    → Routes (solo define endpoints)
    → Controllers (lógica de negocio, responde JSON)
    → Models (consultas SQL a MySQL)
```

### Frontend — Tienda (JavaScript Vanilla)
```
Evento del usuario
    → Controller (orquesta, no renderiza ni hace fetch)
    → Model (solo fetch a la API, lógica de datos)
    → View (solo manipula el DOM)
```

---

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** — Runtime de JavaScript
- **Express.js** — Framework HTTP y enrutamiento
- **MySQL2** — Driver de base de datos
- **Multer** — Middleware para subida de archivos
- **dotenv** — Gestión de variables de entorno

### Frontend — Panel de Administración
- **HTML5** — Estructura semántica
- **Bootstrap 5.3** — Grid y componentes responsivos
- **Font Awesome 6.4** — Iconografía
- **SweetAlert2** — Diálogos de confirmación

### Frontend — Tienda Online
- **HTML5** — Estructura semántica
- **CSS3 Vanilla** — Estilos personalizados (glassmorphism, animaciones)
- **JavaScript ES6+** — Lógica MVC sin frameworks
- **Bootstrap 5.3** — Layout responsivo
- **Font Awesome 6.4** — Iconografía

### Infraestructura
- **Docker + Docker Compose** — Contenerización completa
- **MySQL 8.0** — Base de datos relacional

---

## 📂 Estructura del Proyecto

```text
ExpendioFS/
├── config/
│   └── db.js                    # Pool de conexión MySQL (mysql2)
│
├── controllers/                 # Lógica de negocio (backend)
│   ├── authController.js
│   ├── clientesController.js
│   ├── dashboardController.js
│   ├── detalleVentaController.js
│   ├── empleadosController.js
│   ├── productosController.js   # Incluye upload de imagen
│   ├── proveedoresController.js
│   ├── sucursalesController.js
│   └── ventasController.js
│
├── middlewares/
│   └── upload.js                # Configuración de Multer para imágenes
│
├── models/                      # Consultas SQL (backend)
│   ├── clientes.js
│   ├── detalle_venta.js
│   ├── empleados.js
│   ├── productos.js
│   ├── proveedores.js
│   ├── sucursales.js
│   └── ventas.js
│
├── routes/                      # Definición de endpoints REST
│   ├── authRoutes.js
│   ├── clientesRoutes.js
│   ├── dashboardRoutes.js
│   ├── detalleVentaRoutes.js
│   ├── empleadosRoutes.js
│   ├── productosRoutes.js
│   ├── proveedoresRoutes.js
│   ├── sucursalesRoutes.js
│   └── ventasRoutes.js
│
├── public/
│   ├── css/
│   │   └── style.css            # Estilos del panel admin
│   ├── js/                      # Scripts del panel admin (CRUD directo)
│   │   ├── clientes.js
│   │   ├── dashboard.js
│   │   ├── detalle_venta.js
│   │   ├── empleados.js
│   │   ├── productos.js         # Incluye subida de imágenes
│   │   ├── proveedores.js
│   │   ├── sucursales.js
│   │   ├── utils.js
│   │   └── ventas.js
│   ├── uploads/
│   │   └── productos/           # Imágenes subidas desde el admin
│   │
│   ├── store/                   # Tienda Online (MVC Vanilla JS)
│   │   ├── css/
│   │   │   └── store.css        # Diseño glassmorphism de la tienda
│   │   ├── js/
│   │   │   ├── models/          # Capa de datos (fetch + lógica)
│   │   │   │   ├── CarritoModel.js
│   │   │   │   ├── ClienteModel.js
│   │   │   │   ├── ProductoModel.js  # Incluye método filtrar()
│   │   │   │   ├── StoreModel.js
│   │   │   │   └── VentaModel.js
│   │   │   ├── views/           # Capa de renderizado (solo DOM)
│   │   │   │   ├── CatalogoView.js
│   │   │   │   ├── CheckoutView.js
│   │   │   │   ├── HomeView.js
│   │   │   │   ├── ProductoView.js
│   │   │   │   └── StoreView.js
│   │   │   ├── controllers/     # Orquestadores (sin HTML ni fetch)
│   │   │   │   ├── CarritoController.js
│   │   │   │   ├── CatalogoController.js
│   │   │   │   ├── CheckoutController.js
│   │   │   │   ├── HomeController.js
│   │   │   │   ├── LoginController.js
│   │   │   │   ├── PerfilController.js
│   │   │   │   ├── ProductoController.js
│   │   │   │   ├── RegistroController.js
│   │   │   │   └── StoreController.js
│   │   │   └── components/
│   │   │       ├── navbar.js    # Navbar global + mini-carrito drawer
│   │   │       └── toast.js     # Sistema de notificaciones
│   │   ├── carrito.html
│   │   ├── catalogo.html
│   │   ├── checkout.html
│   │   ├── confirmacion.html
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── perfil.html
│   │   ├── producto.html
│   │   └── registro.html
│   │
│   ├── index.html               # Dashboard del panel admin
│   ├── clientes.html
│   ├── empleados.html
│   ├── productos.html
│   ├── proveedores.html
│   ├── sucursales.html
│   ├── ventas.html
│   └── detalle_venta.html
│
├── expendio_bebidas.sql         # Schema + datos de prueba
├── server.js                    # Entry point de Express
├── package.json
└── docker-compose.yml           # App Node:20 + MySQL 8.0
```

---

## ⚙️ Cómo ejecutar el proyecto

### Requisitos previos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/ExpendioFS.git
cd ExpendioFS

# 2. Levantar los contenedores
docker compose up --build
```

> **Primera vez:** Docker descarga las imágenes de Node.js y MySQL, instala dependencias e inicializa la base de datos con el archivo `expendio_bebidas.sql` automáticamente. Puede tomar 2-3 minutos.

```bash
# 3. Acceder a la aplicación
Panel Admin:  http://localhost:3000
Tienda:       http://localhost:3000/store/index.html
Base de datos (opcional): localhost:3307 (root / rootpassword)
```

### Variables de entorno (`.env`)
Para ejecutar sin Docker, crear un archivo `.env` en la raíz:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=expendio_bebidas
PORT=3000
```

---

## 🗄️ Base de Datos

### Tablas

| Tabla | Descripción |
|---|---|
| `sucursales` | Información de cada sucursal física |
| `empleados` | Personal vinculado a una sucursal |
| `clientes` | Clientes de la tienda online (con `password`) |
| `proveedores` | Proveedores con RFC y crédito |
| `productos` | Catálogo (con `imagen` para la tienda) |
| `ventas` | Cabecera de cada orden de compra |
| `detalle_venta` | Partidas de productos por venta (con `entregado`) |

### Flujo de Datos

```
Cliente (navegador)
    ↓ fetch()
Express Server (server.js)
    ↓ router
Routes (routes/*.js)          → solo define endpoints
    ↓ controller.method
Controllers (controllers/)    → lógica, responde JSON
    ↓ Model.query()
Models (models/)              → SQL contra MySQL
    ↓ resultado
MySQL 8.0 (contenedor Docker)
```

---

## 🚧 Funcionalidades Pendientes (Roadmap)

Las siguientes funcionalidades elevarían el sistema a un nivel enterprise completo:

### 🔴 Alta Prioridad
- [ ] **Contraseñas seguras** — Implementar hashing con `bcrypt` en el modelo de clientes
- [ ] **Sesiones con JWT** — Reemplazar `localStorage` por tokens firmados para mayor seguridad
- [ ] **Paginación en el catálogo** — Para catálogos de más de 100 productos
- [ ] **Búsqueda en el admin** — Input de búsqueda en las tablas del panel

### 🟡 Media Prioridad
- [ ] **Sistema de puntos real** — Lógica de acumulación de puntos al completar una compra
- [ ] **Notificaciones por email** — Confirmación de orden al cliente via SMTP (Nodemailer)
- [ ] **Panel de tracking admin** — Cambiar estatus de pedidos en tiempo real (`entregado`)
- [ ] **Detalle de pedido** — Vista expandible del pedido en el perfil del cliente
- [ ] **Búsqueda con debounce global** — Conectar autocompletado del navbar con más entidades
- [ ] **Imágenes con optimización** — Comprimir imágenes subidas (sharp.js)

### 🟢 Baja Prioridad / Mejoras UX
- [ ] **Modo oscuro/claro** — Toggle de tema en el admin
- [ ] **Exportar a CSV/PDF** — Reportes de ventas desde el panel
- [ ] **Gráficas en el dashboard** — Chart.js para ventas por período
- [ ] **PWA (Progressive Web App)** — Service Worker para uso offline
- [ ] **Wishlist / Favoritos** — Guardar productos para después
- [ ] **Cupones de descuento** — Código promocional en el checkout
- [ ] **Múltiples imágenes** — Galería de fotos por producto
- [ ] **Reviews y calificaciones** — Sistema de reseñas de clientes

---

## 🔐 Seguridad (Estado Actual)

| Aspecto | Estado | Notas |
|---|---|---|
| Passwords en texto plano | ⚠️ Pendiente | Usar `bcrypt` en producción |
| Sesiones en localStorage | ⚠️ Limitado | Migrar a JWT/Cookies HttpOnly |
| Validación de inputs | ✅ Frontend | Añadir validación en backend también |
| CORS configurado | ✅ Activo | `cors` middleware en server.js |
| Tipos de archivo en upload | ✅ Validado | Solo jpeg/jpg/png/gif/webp, máx 5MB |
| Variables de entorno | ✅ dotenv | No hardcodeadas en el código |

---

## 👥 Credenciales de Prueba

Para probar la tienda online, primero registra un usuario en:
```
http://localhost:3000/store/registro.html
```

O usa la sección de **Clientes** del panel admin para crear uno manualmente.

---

## 🤝 Contribuir

```bash
# Crear una rama de feature
git checkout -b feature/nombre-funcionalidad

# Hacer cambios y commit
git commit -m "feat: descripción del cambio"

# Push y Pull Request
git push origin feature/nombre-funcionalidad
```

---

## 📄 Licencia

MIT — Libre para uso educativo y comercial.

---

*Desarrollado con ❤️ como proyecto académico de arquitectura de software.*
