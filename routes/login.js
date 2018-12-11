let express = require('express');
let bycrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

let SEED =require('../config/config').SEED;
let Usuario = require('../models/usuario');


let app = express();


app.post('/', (req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: true,
                mensaje: 'Error al cargar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bycrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // Crear token | Duración 4 horas
        usuarioDB.password = ':)'; // No mostrar contraseña
        let token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 14400});

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    });
});








module.exports = app;