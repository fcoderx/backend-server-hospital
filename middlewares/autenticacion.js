let jwt = require('jsonwebtoken');

let SEED =require('../config/config').SEED;

// ======================================
//      Verificar token
// ======================================
exports.verificaToken = function(req, res, next){

    let token = req.query.token;

    jwt.verify(token, SEED, (err, decode) => {

        if (err) {
            return res.status(401).json({
                ok: true,
                mensaje: 'Token no valido',
                errors: err
            });
        }

        req.usuario = decode.usuario;

        next();
    });
};