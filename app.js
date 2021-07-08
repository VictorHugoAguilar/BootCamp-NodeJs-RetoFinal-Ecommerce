'use strict'
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
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

// BD
dbConnection();

// Levantamos el server
app.listen(process.env.PORT, () => {
    winston.log('info', `app run in port ${PORT}`, { service: 'raising server' });
});