const jwt = require('jsonwebtoken');

// =============================
//        VERIFY TOKEN
// =============================

const { SEED } = process.env;

let verifyingToken = (req, res, next) => {
    let token = req.get('token'); 

    jwt.verify(token, SEED, (err, decoded) => {

        if(err) {
            res.status(401).json({
                ok: false,
                err: {
                    message: 'invalid token'
                }
            })
            return;
        }

        req.user = decoded.user; // decoded es el payload
        next();
    })
}

// =============================
//      VERIFY ADMIN_ROLE
// =============================

let verifyingAdminRole = (req, res, next) => {

    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: "The user isn't admin"
            }
        })
    }
}

module.exports = {verifyingToken, verifyingAdminRole}