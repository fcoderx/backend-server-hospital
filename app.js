// Requires
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');

// Inicializando variables
let app = express(); 


// Body Parser
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Importando rutas
let appRoutes = require('./routes/app');
let usuarioRoutes = require('./routes/usuario');
let loginRoutes = require('./routes/login');

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m','online');
});


// Escuchando peticiones
app.listen(3000, () => {
    console.log('Servidor en el puerto 3000: \x1b[32m%s\x1b[0m','online');
});


// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);
