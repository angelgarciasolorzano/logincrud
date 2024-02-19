import mysql from "mysql2/promise";
import { database } from "./keys.js"

const pool = mysql.createPool(database);

pool.getConnection().then((connection, err) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Se perdió la conexión a la base de datos');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('La base de datos tiene demasiadas conexiones');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Se ha rechazado la conexión a la base de datos');
    }
  }
  if (connection) connection.release();
  console.log('La base de datos está conectada');
  return;
});

export default pool;