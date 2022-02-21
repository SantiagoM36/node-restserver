const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

const Usuario = require('../models/user');

const { EXPIRED_TOKEN, SEED } = process.env;

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, userDB) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
            return;
        }

        /*if (!userDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: '(User) or password incorrect'
                }
            })
            return;
        }*/

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'User (or password) incorrect'
                }
            })
            return;
        }

        const token = jwt.sign({
            user: userDB //payload
        }, SEED, { expiresIn: EXPIRED_TOKEN });

        res.json({
            ok: true,
            user: userDB,
            token
        });

    })

});

module.exports = app;