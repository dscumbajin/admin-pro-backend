require('dotenv').config();
const path = require('path');
const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');

// Crear el servidor de express
const app = express();

// Configuaracion CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Base de Datos
dbConnection();

// Directorio Publico
app.use(express.static('public'));

// Rutas
app.use('/api/usuarios', require('./routes/usuarios.route'));
app.use('/api/hospitales', require('./routes/hospitales.route'));
app.use('/api/medicos', require('./routes/medicos.route'));
app.use('/api/login', require('./routes/auth.route'));
app.use('/api/todo', require('./routes/busquedas.route'));
app.use('/api/upload', require('./routes/uploads.route'));

// Lo ultimo
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto: ' + process.env.PORT);
});