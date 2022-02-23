const express = require('express');
const app = express();

app.use(require('./user.routes'))
app.use(require('./login.routes'))
app.use(require('./category.routes'))
app.use(require('./product.routes'))
app.use(require('./upload.routes'))

module.exports = app;