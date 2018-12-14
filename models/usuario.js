let mongoose = require('mongoose');
let uniqueValdator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

let usuarioSchema = new Schema({

    nombre: {type: String, required: [true, 'El nombre es necesario']},
    email: {type: String, unique: true, required: [true, 'El correo es necesario']},
    password: {type: String,  required: [true, 'La contraseña es requerida']},
    img: {type: String, required: false},
    role: {type: String,  required: true, default: 'USER_ROLE', enum: rolesValidos},
    google: {type: Boolean, default: false}

}); 

usuarioSchema.plugin(uniqueValdator, {message: '{PATH} debe de ser unico'});

module.exports = mongoose.model('Usuario', usuarioSchema);