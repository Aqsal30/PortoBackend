const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json());
app.use(cors())
const PORT = process.env.PORT || 5000;
const db = require('./Connection')
const response = require('./response')

const base = require('./routes/base')
const menu = require('./routes/menu')
const order = require('./routes/order')

app.use('/base', base)
app.use('/menu', menu)
app.use('/order', order)


module.exports = app;