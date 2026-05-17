const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'gecit_db'
  });

  try {
    const [roles] = await connection.query('SELECT * FROM roles');
    console.log('--- ROLES ---');
    console.log(roles);

    const [users] = await connection.query('SELECT id, nombre, apellidos, email, id_rol, id_entidad FROM usuarios LIMIT 5');
    console.log('\n--- USERS ---');
    console.log(users);
  } catch (err) {
    console.error('Error querying database:', err.message);
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
