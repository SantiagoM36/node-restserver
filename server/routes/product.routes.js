const express = require('express');
const { verifyingToken } = require('../middlewares/authentication');
const app = express();

const Product = require('../models/product.models');

app.get('/products', verifyingToken, (req, res) => {

    Product.find({})
        .sort('name')
        .populate('category', 'description')
        .populate('user', 'name email')
        .exec((err, products) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                })
                return;
            }

            res.json({
                ok: true,
                products
            })
        })
})

app.get('/product/:id', verifyingToken, (req, res) => {
    //populate: user category
    let id = req.params.id;

    Product.findById(id)
    .populate('category', 'description') 
    .populate('user', 'name email')
    .exec((err, productDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
            return;
        }

        if (!productDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'ID not found'
                }
            })
            return;
        }
        res.json({
            ok: true,
            product: productDB
        })
    })

})

// ==============================
//         Search product
// ==============================

app.get('/product/search/:term', verifyingToken, (req, res)  => {

    let term = req.params.term;

    let regex = new RegExp(term, 'i');

    Product.find({name: regex})
        .populate('category', 'description')
        .exec((err, products) => {
            if(err) {
                res.status(400).json({
                    ok: false,
                    err
                })
                return;
            }

            res.json({
                ok: true,
                products
            })
        })



})


// ==============================
//         Create product
// ==============================

app.post('/product', verifyingToken, (req, res) => {
    let body = req.body;

    let product = new Product({
        user: req.user._id,
        name: body.name,
        uPrice: body.uPrice,
        desc: body.desc,
        avaliable: body.avaliable,
        category: body.category
    })

    product.save((err, productDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
            return;
        }

        if (!productDB) {
            res.status(400).json({
                ok: false,
                err
            })
            return;
        }

        res.status(201).json({
            ok: true,
            product: productDB
        })
    })

})

app.put('/product/:id', verifyingToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descProduct = {
        name: body.name,
        uPrice: body.uPrice,
        desc: body.desc,
        avaliable: body.avaliable,
        category: body.category
    }

    Product.findByIdAndUpdate(id, descProduct, { new: true, runValidators: true }, (err, productDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
            return;
        }

        if (!productDB) {
            res.status(400).json({
                ok: false,
                err
            })
            return;
        }

        res.json({
            ok: true,
            product: productDB
        })

    })

})

app.delete('/product/:id', verifyingToken, (req, res) => {
    let id = req.params.id;

    Product.findById(id, (err, productDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
            return;
        }

        if (!productDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'ID does not exist'
                }
            })
            return;
        }

        productDB.avaliable = false;

        productDB.save((err, productDeleted) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
                return;
            }

            res.json({
                ok: true,
                product: productDeleted,
                message: 'Product delete'
            })
        })
    })
})


module.exports = app;