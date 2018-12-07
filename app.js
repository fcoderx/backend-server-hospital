// Requires
let express = require('express');
let mongoose = require('mongoose');

// Inicializando variables
let app = express(); 

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
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});