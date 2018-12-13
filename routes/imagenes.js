let express = require('express');

let app = express();

const path = require('path');

const fs = require('fs');

// 
app.get('/:tipo/:img', (req, res, next) => {

    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImg = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        let pathNoImg = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImg);
    }
});

module.exports = app;