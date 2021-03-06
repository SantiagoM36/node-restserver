require('./config/config')

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

app.use(require('./routes/index.routes'))

const { PORT, URLDB } = process.env;

mongoose.connect(URLDB, 
       //{useNewUrlParser: true, useCreateIndex: true},
        (err, res) => {
            if( err ) throw err;

            console.log('Base de datos ONLINE')
        }
);

app.listen(PORT, () => {
    console.log('Escuchando peticiones en puerto: ', PORT)
})