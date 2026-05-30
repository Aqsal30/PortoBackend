const express = require('express')
const router = express.Router()
const db = require('../Connection')

router.get('/', async (req,res) => {
    const sql = await db.any('SELECT * FROM public.menu')
    res.json(sql)
})

module.exports = router;