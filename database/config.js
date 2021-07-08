const mongoose = require('mongoose');
const winston = require('../logs/winston');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        winston.log('info', `database operative ${process.env.DB_CNN}`, { service: 'conection on database mongodb' });
    } catch (error) {
        winston.log('error', 'error of conection with database', { service: 'conection on database mongodb' })
        throw new Error('No se ha podido levantar el servidor de BD');
    }
}

module.exports = {
    dbConnection: dbConnection
}