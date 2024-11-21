const mysql = require('mysql2');
require('dotenv').config();  // Cargar variables de entorno desde .env

console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);
console.log(process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 100, // Número máximo de conexiones en el pool
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos.');
  connection.release(); // Liberar la conexión de vuelta al pool
});

module.exports = pool;