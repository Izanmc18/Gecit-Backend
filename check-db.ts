
import { createConnection } from 'typeorm';
import { Sala } from './src/salas/entities/sala.entity';

async function check() {
  try {
    const connection = await createConnection({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'gecit_db',
      entities: [Sala],
      synchronize: false,
    });

    const salas = await connection.getRepository(Sala).find();
    console.log('SALAS EN BD:', JSON.stringify(salas, null, 2));
    await connection.close();
  } catch (err) {
    console.error('ERROR AL CONECTAR:', err);
  }
}

check();
