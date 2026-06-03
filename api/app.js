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
const menuRoutes = require("./routes/menupost")

app.get('/', (req, res) => {
  res.status(200).json({
    data: "ini data",
    message: "ini pesan"
  })
})

app.use('/base', baseapi)
app.use('/menu', menuapi)
app.use('/order', orderapi)
app.use('/updatemenu', menuRoutes)
module.exports = app;