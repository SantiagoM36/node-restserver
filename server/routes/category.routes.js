const express = require('express');
const { verifyingToken, verifyingAdminRole } = require('../middlewares/authentication');
const app = express();

const Category = require('../models/category.models');

app.get('/categories', verifyingToken, (req, res) => {

    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                })
                return;
            }

            res.json({
                ok: true,
                categories
            })
        })

})

app.get('/category/:id', verifyingToken, (req, res) => {
    let id = req.params.id;

    Category.findById(id, (err, categoryDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
            return;
        }

        if (!categoryDB) {
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
            category: categoryDB
        })
    })

})

app.post('/category', verifyingToken, (req, res) => {
    let body = req.body;

    let category = new Category({
        description: body.description,
        user: req.user._id
    })

    category.save((err, categoryDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
            return;
        }

        if (!categoryDB) {
            res.status(400).json({
                ok: false,
                err
            })
            return;
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    })
})

app.put('/category/:id', verifyingToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategory = {
        description: body.description
    }

    Category.findByIdAndUpdate(id, descCategory, { new: true, runValidators: true }, (err, categoryDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
            return;
        }

        if (!categoryDB) {
            res.status(400).json({
                ok: false,
                err
            })
            return;
        } 

        res.json({
            ok: true,
            category: categoryDB
        })

    })

})

app.delete('/category/:id', [verifyingToken, verifyingAdminRole], (req, res) => {
    //solo un admin puede borrar categorias
    // Category.findByIdAndRemove
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
            return;
        }

        if (!categoryDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'ID does not exist'
                }
            })
            return;
        } 

        res.json({
            ok: true,
            message: 'Category delete'
        })
    })
})

module.exports = app;