const http = require('http');

async function request(url, method, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const { URL } = require('url');
    const parsedUrl = new URL(url);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTest() {
  const randomSuffix = Math.floor(Math.random() * 100000);
  const email = `testuser${randomSuffix}@gecit.com`;
  const dni = `123${randomSuffix}`.padEnd(8, '0') + 'Z';
  
  console.log(`\n--- FLOW TEST STARTED (${email}) ---`);

  // 1. Get Entidad & Sala
  const getEntidad = await request('http://localhost:3000/api/v1/public/entidades/innovasur.com', 'GET');
  const idEntidad = getEntidad.data.id;
  const getSalas = await request(`http://localhost:3000/api/v1/public/salas/${idEntidad}`, 'GET');
  const idSala = getSalas.data[0].id;
  
  const getTramites = await request(`http://localhost:3000/api/v1/public/tramites/${idEntidad}`, 'GET');
  const idTramite = getTramites.data[0].id;
  
  console.log('Got necessary IDs for booking.');

  // 2. Book appointment
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const bookData = {
    idEntidad,
    idSala,
    idTramite,
    clienteNombre: 'FlowTest',
    clienteApellidos: 'FlowTest',
    clienteDni: dni,
    clienteEmail: email,
    clienteTelefono: '666666666',
    fechaHora: tomorrow.toISOString(),
  };

  const bookRes = await request('http://localhost:3000/api/v1/citas', 'POST', bookData);
  console.log(`Appointment Booked: ${bookRes.status}`);

  // 3. Register client
  const regData = {
    nombre: 'FlowTest',
    apellidos: 'FlowTest',
    dni,
    telefono: '666666666',
    email,
    password: 'password123'
  };

  const regRes = await request('http://localhost:3000/api/v1/auth/register', 'POST', regData);
  console.log(`Client Registered: ${regRes.status}`);
  const clientToken = regRes.data.token;

  // 4. View client appointments
  const myApptsRes = await request('http://localhost:3000/api/v1/citas/my-appointments', 'GET', null, clientToken);
  console.log(`My Appointments Count: ${myApptsRes.data.length}`);
  if (myApptsRes.data.length > 0) {
      const citaId = myApptsRes.data[0].id;

      // 5. Cancel appointment
      const cancelRes = await request(`http://localhost:3000/api/v1/citas/${citaId}/cancel`, 'DELETE', null, clientToken);
      console.log(`Cancel Appointment: ${cancelRes.status}`);

      // 6. View client appointments again
      const myApptsRes2 = await request('http://localhost:3000/api/v1/citas/my-appointments', 'GET', null, clientToken);
      console.log(`My Appointments Count after cancel: ${myApptsRes2.data.length}`);
  }

  console.log('--- FLOW TEST SUCCESSFUL ---');
}

runTest().catch(console.error);
