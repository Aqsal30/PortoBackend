const express = require('express')
const router = express.Router()
const db = require('../../Connection')
const response = require('../response')

router.get('/', async (req,res) => {
    const sql = await db.any('SELECT * FROM public.order_items')
    res.json(sql)
})

module.exports = router;