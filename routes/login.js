let express = require('express');
let bycrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

let SEED =require('../config/config').SEED;
let Usuario = require('../models/usuario');


let app = express();

// Google
let CLIENT_ID = require('../config/config').CLIENT_ID;
let {OAuth2Client} = require('google-auth-library');
let client = new OAuth2Client(CLIENT_ID);


// ======================================
//      Autenticación Google
// ======================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {
    
    let token = req.body.token;

    let googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            ok: false,
            mensaje: 'Token no valido'
        });
    });

    Usuario.findOne({email: googleUser.email}, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: true,
                mensaje: 'Error al cargar usuario',
                errors: err
            });
        } 

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Debe usar autenticacion normal'
                });
            } else {
                let token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 14400});

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });
            }
        } else {
            // El usuario no existe, hay que crearlo 
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save( (err, usuarioDB) => {
                let token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 14400});
    
                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });
            });
        } 
    });

    /* return res.status(200).json({
        ok: true,
        mensaje: 'ok',
        googleUser: googleUser
    }); */
});




// ======================================
//      Autenticación Normal
// ======================================
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