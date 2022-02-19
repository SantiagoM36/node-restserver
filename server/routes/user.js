const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();

const Usuario = require('../models/user');

app.get('/usuario', (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    Usuario.find({state: true}, 'name email role state google')
            .skip(from)
            .limit(limit)
            .exec((err, users) => {
                if(err) {
                    res.status(400).json({
                        ok: false,
                        err
                    })
                    return;
                }

                Usuario.count({state: true}, (err, count) => {
                    res.json({
                        ok: true,
                        users,
                        count
                    });
                })

                
            });
})

app.post('/usuario', (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, userDB) => {
        if(err) {
            res.status(400).json({
                ok: false,
                err
            })
            return;
        }

        //userDB.password = null;

        res.json({
            ok: true,
            user: userDB
        });
    });

})

app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    /*delete body.password;
    delete body.google;*/

    Usuario.findByIdAndUpdate(id, body, { new:true, runValidators: true }, (err, userDB) => {

        if(err) {
            res.status(400).json({
                ok: false,
                err
            })
            return;
        }

        res.json({
            ok: true,
            user: userDB
        });

    })
    
})

app.delete('/usuario/:id', (req, res) => {
    
    let id = req.params.id;

   

    //Usuario.findByIdAndRemove(id, (err, userDelete) => {

    let changeState = {state: false}

    Usuario.findByIdAndUpdate(id, changeState, { new:true }, (err, userDelete) => {

        if(err) {
            res.status(400).json({
                ok: false,
                err
            })
            return;
        }

        if( !userDelete ) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'user not found'
                }
            })
            return;
        }

        res.json({
            ok: true,
            userDelete
        })

    })

})

module.exports = app;