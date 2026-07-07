const express = require('express')
const cors = require('cors')
const app = express()
const swaggerJSdocs = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
app.use(express.json());
app.use(cors())

const db = require('../Connection')
const response = require('./response')

const baseapi = require('./routes/baseapi')
const menuapi = require('./routes/menuapi')
const orderapi = require('./routes/orderapi')
const menuRoutes = require("./routes/menupost")
const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Express Swagger Demo",
      version: "1.0.0",
      description: "My first Swagger API",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./index.js"],
};

const swaggerSpec = swaggerJSdocs(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /hello:
 *   get:
 *     summary: Returns a hello message
 *     tags:
 *       - Hello
 *     responses:
 *       200:
 *         description: Success
 */

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