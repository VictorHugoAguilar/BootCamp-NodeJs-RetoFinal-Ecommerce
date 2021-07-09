'use strict'
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const winston = require('./logs/winston');
const morgan = require('morgan')

const PORT = process.env.PORT || 3003;
const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();

app.use(morgan('combined', { stream: winston.stream }));

// Habilitamos las politicas CORS
app.use(cors());

// lectura y parseo del body
app.use(express.json());
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// BD
dbConnection();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow', 'GET, PUT, POST, DELETE, OPTIONS');
    next();
});

// Routes Apis
app.use('/api/clientes', require('./routes/cliente.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/productos', require('./routes/producto.routes'));


// Levantamos el server
app.listen(process.env.PORT, () => {
    winston.log('info', `app run in port ${PORT}`, { service: 'raising server' });
});

module.exports = app;