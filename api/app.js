const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json());
app.use(cors())
const db = require('./Connection')
const response = require('./response')

const baseapi = require('./routes/baseapi')
const menuapi = require('./routes/menuapi')
const orderapi = require('./routes/orderapi')

app.use('/base', baseapi)
app.use('/menu', menuapi)
app.use('/order', orderapi)

console.log('base:', baseapi)
console.log('menu:', menuapi)
console.log('order:', orderapi)

module.exports = app;