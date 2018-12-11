let express = require('express');

let bycrypt = require('bcryptjs');

let jwt = require('jsonwebtoken');

let mdAutenticacion = require('../middlewares/autenticacion');

let app = express();

// Importar el modelo 
let Usuario = require('../models/usuario');

// ======================================
//      Obtener todos los usuarios
// ======================================
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {

        if (err) {
            return res.status(500).json({
                ok: true,
                mensaje: 'Error al cargar usuarios',
                errors: err
            });
        } 

        res.status(200).json({
            ok: true,
            usuarios: usuarios
        });
    });
}); 





// ======================================
//      Actualizar usuario
// ======================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: true,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: true,
                mensaje: `El usuario con el id ${id} no existe`,
                errors: err
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save( (err, usuarioGuardado) => {
            
            if (err) {
                return res.status(500).json({
                    ok: true,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});


// ======================================
//      Crear un nuevo usuario
// ======================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bycrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save( (err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        } 

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        }); 
    });
}); 


// ======================================
//      Borrar usuario por el id
// ======================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: true,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        } 

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: true,
                mensaje: 'No existe un usuario con ese id',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;