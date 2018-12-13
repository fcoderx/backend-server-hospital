let express = require('express');

let app = express();

let Hospital = require('../models/hospital');
let Medico = require('../models/medico');
let Usuario = require('../models/usuario');

// ======================================
//      Busqueda por colección
// ======================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    let busqueda = req.params.busqueda;
    let tabla = req.params.tabla;
    let regexp = new RegExp(busqueda, 'i');
    let promesa;

    if (tabla === 'medicos') {
        promesa = buscarMedicos(regexp);
    } else if (tabla === 'hospitales') {
        promesa = buscarHospitales(regexp);
    } else if (tabla === 'usuarios') {
        promesa = buscarUsuarios(regexp);
    } else {
        return res.status(400).json({
            ok: false,
            message: 'Los tipos son: usuarios, medicos o hospitales'
        });
    }

    promesa.then(data => {
        
        res.status(200).json({
            ok: true,
            [tabla]: data
        }); 
    });
});



// ======================================
//      Busqueda general
// ====================================== 
app.get('/todo/:busqueda', (req, res, next) => {

    let busqueda = req.params.busqueda;
    let regexp = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(regexp),
        buscarMedicos(regexp),
        buscarUsuarios(regexp)
    ])
    .then(respuestas => {
        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    });
});


function buscarHospitales(regexp) {
    return new Promise( (resolve, reject) => {
        Hospital.find({nombre: regexp})
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) =>{

            if (err) {
                reject('Error al cargar los hospitales', err);
            } else {
                resolve(hospitales);
            }
        });
    });
}

function buscarMedicos(regexp) {
    return new Promise( (resolve, reject) => {
        Medico.find({nombre: regexp})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) =>{

            if (err) {
                reject('Error al cargar los medicos', err);
            } else {
                resolve(medicos);
            }
        });
    });
}

function buscarUsuarios(regexp) {
    return new Promise( (resolve, reject) => {
        Usuario.find({}, 'nombre email role')
        .or([{nombre: regexp}, {email: regexp}])
        .exec((err, usuarios) => {
            if (err) {
                reject('Error al cargar usuarios', err);
            } else {
                resolve(usuarios);
            }
        });
    });
}


module.exports = app;