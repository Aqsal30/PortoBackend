const express = require('express')
const router = express.Router()
const db = require('../../Connection')

router.get('/', (req, res) => {
  res.status(200).json({
    data: "ini data",
    message: "ini pesan"
  })
})

module.exports = router