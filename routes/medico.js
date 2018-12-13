let express = require('express');

let mdAutenticacion = require('../middlewares/autenticacion');

let app = express();

// Importar el modelo 
let Medico = require('../models/medico');

// ======================================
//      Obtener todos los medicos
// ======================================
app.get('/', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('hospital')
    .exec((err, medicos) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al cargar medicos',
                errors: err
            });
        }
        
        Medico.count({}, (err, conteo) => {

            res.status(200).json({
                ok: true,
                medicos: medicos,
                total: conteo
            });
        });
    });
}); 





// ======================================
//      Actualizar medico
// ======================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medicos',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: `El medico con el id ${id} no existe`,
                errors: err
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save( (err, medicoGuardado) => {
            
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });
});


// ======================================
//      Crear un nuevo medico
// ======================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    let body = req.body;

    let medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save( (err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        } 

        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        }); 
    });
}); 


// ======================================
//      Borrar medico por el id
// ======================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    let id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        } 

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese id',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});

module.exports = app;