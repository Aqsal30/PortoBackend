const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json());
app.use(cors())
const port = 5000
const menuRoutes = require("./routes/menupost")
app.use("/menu", menuRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})