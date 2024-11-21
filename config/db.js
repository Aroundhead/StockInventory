const mysql = require('mysql2');
require('dotenv').config();  // Cargar variables de entorno desde .env

// Usa la URL de conexión directamente desde tu .env
const DATABASE_URL = process.env.MYSQL_URL;

const connection = mysql.createConnection(DATABASE_URL);

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos.');
});

module.exports = connection;
