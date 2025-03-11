// server.js
const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
const app = express();
const port = process.env.PORT || 3000;

// Configuración de Google Sheets API
const sheets = google.sheets('v4');
const KEYFILEPATH = 'app-registro-clientes-c370668c53c1.json';
const SPREADSHEET_ID = '11jwdAsgNgpv_O6UQ-oAQeM78S1Vx6tDwINvowesu2yw'; // Reemplaza con el ID de tu hoja de cálculo
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

// Configurar autenticación básica
app.use(basicAuth({
  users: { 'Vamagro': 'ruta9km501' },
  challenge: true,
  realm: 'Área Privada'
}));

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/clientes', async (req, res) => {
  try {
    const client = await auth.getClient();
    const {
      nombre,
      apellido,
      cuit,
      razon_social,
      telefono,
      email,
      localidad,
      provincia,
      maquina,
      maquina_futura,
      tipo
    } = req.body;

    // Se agrega la fecha actual para registro
    const values = [[
      nombre,
      apellido,
      cuit,
      razon_social,
      telefono,
      email,
      localidad,
      provincia,
      maquina,
      maquina_futura,
      tipo,
      new Date().toISOString()
    ]];
    const resource = { values };

    const result = await sheets.spreadsheets.values.append({
      auth: client,
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A1', // Ajusta el rango según corresponda
      valueInputOption: 'RAW',
      resource: resource,
    });

    res.status(200).json({ message: 'Cliente agregado exitosamente', result });
  } catch (error) {
    console.error('Error al agregar el cliente: ', error);
    res.status(500).json({ error: 'Error al agregar el cliente' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
