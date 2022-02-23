const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const { validateExt, validateTypes } = require('../utils/utils');
const app = express();

const User = require('../models/user.models');
//const Product = require('../models/product.models');

// default options - req.files
app.use(fileUpload());

app.put('/upload/:type/:id', function (req, res) {
    let type = req.params.type;
    let id = req.params.id;
    //let name = req.params.name;

    let file, uploadPath, nameF, ext;

    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        })
        return;
    }
    //Tipos permitidos
    if(validateTypes(type)) {
        let validateTypes = ['products', 'users']
        res.status(400).json({
            ok: false,
            err: {
                message: `Los tipos permitidos son: ${validateTypes.join(', ')}`
            }
        })
        return;
    }

    //Extensiones permitidas
    file = req.files.file;
    nameF = file.name.split('.');
    ext = nameF[nameF.length - 1];
    
    if (validateExt(file)) {
        let validateExt = ['png', 'jpg', 'gif', 'jpeg'];
        res.status(400).json({
            ok: false,
            err: {
                message: `Las extensiones permitidas son: ${validateExt.join(', ')}`,
                ext
            }
        })
        return;
    } 

    //Change file name
    let fileName = `${id}-${type.toUpperCase()}-${new Date().getTime()}.${ext}`

    uploadPath = `uploads/${type}/${fileName}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(uploadPath, (err) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
            return;
        }

        //La imagen ya esta cargada en este punto

        imageUser(id, res, fileName)
    });
});

function imageUser(id, res, fileName) {

    User.findById(id, (err, userDB) => {
        if(err){
            res.status(500).json({
                ok: false,
                err
            })
            return;
        }

        if(!userDB){
            res.status(400).json({
                ok: false,
                err: {
                    message: 'User not exists'
                }
            })
            return;
        }

        //Verificando ruta del file
        /*let pathIMG = path.resolve(__dirname, `../../uploads/users/${userDB.img}`);
        if(fs.existsSync(pathIMG)) {
            //borra el path del file
            fs.unlink(pathIMG);
        }*/

        userDB.img = fileName;

        console.log('USERDB: ', userDB)

        userDB.save((err, userSaved) => {
            console.log('userSaved: ', userSaved)
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
                return;
            }

            res.json({
                ok: true,
                user: userSaved
            })
        })

    })
}

module.exports = app;