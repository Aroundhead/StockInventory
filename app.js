const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');
require('dotenv').config(); // Cargar variables de entorno desde .env

const connection = require('./config/db'); // Asegúrate de que esta ruta es correcta
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); // Asegúrate de que la ruta sea correcta
const stateRoutes = require('./routes/stateRoutes');
const providerRoutes = require('./routes/providerRoutes'); // Asegúrate de que la ruta sea correcta
const userRoutes = require('./routes/userRoutes');
const movimientoRoutes = require('./routes/movimientoRoutes'); // Import the route
const notificationRoutes = require('./routes/notificationRoutes');
const port = process.env.PORT || 3000;
const { isAuthenticated, isAdmin, isActiveUser } = require('./middleware/authMiddleware');
const homeController = require('./controllers/homeController');

// Middleware para manejar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS
app.use(cors({
  origin: '*', // Permitir todas las solicitudes de origen
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
}));

// Configuración de sesiones con MySQLStore
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

app.use(session({
  key: 'session_cookie_name',
  secret: 'clave_secreta', // Cambia esto por un valor seguro
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Cambia a `true` si usas HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 // 1 hora
  }
}));

// Middleware para evitar el caché en páginas protegidas
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  next();
});

// Servir archivos estáticos desde la carpeta "views"
app.use(express.static(path.join(__dirname, 'views')));

// Rutas para las páginas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/inventory', (req, res) => {
  if (req.session && req.session.userId) {
    res.sendFile(path.join(__dirname, 'views', 'inventory.html'));
  } else {
    res.redirect('/');
  }
});

app.get('/home', (req, res) => {
  if (req.session && req.session.userId) {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
  } else {
    res.redirect('/');
  }
});

app.get('/provider', (req, res) => {
  if (req.session && req.session.userId) {
    res.sendFile(path.join(__dirname, 'views', 'provider.html'));
  } else {
    res.redirect('/');
  }
});

app.get('/users', (req, res) => {
  if (req.session && req.session.userId) {
    res.sendFile(path.join(__dirname, 'views', 'user.html'));
  } else {
    res.redirect('/');
  }
});

app.get('/notification', (req, res) => {
  if (req.session && req.session.userId) {
    res.sendFile(path.join(__dirname, 'views', 'notification.html'));
  } else {
    res.redirect('/');
  }
});

app.get('/api/home', homeController.getHomeData);

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/users', userRoutes); // Ruta API para usuarios
app.use('/api/movimientos', movimientoRoutes);
app.use('/api/notifications', notificationRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});