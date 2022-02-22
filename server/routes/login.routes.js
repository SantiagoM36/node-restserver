const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { CLIENT_ID } = process.env;
const client = new OAuth2Client(CLIENT_ID);

const app = express();

const Usuario = require('../models/user.models');

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

        if (!userDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: '(User) or password incorrect'
                }
            })
            return;
        }

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

// Google Config
async function verify(googletoken) {
    const ticket = await client.verifyIdToken({
        idtoken: googletoken,
        audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];

    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);

    //return payload
}
//verify(token).catch(console.error)


app.post('/google', (req, res) => {
    let token = req.body.idtoken;

    //await verify(token)

    res.json({
        token
    })
})

module.exports = app;