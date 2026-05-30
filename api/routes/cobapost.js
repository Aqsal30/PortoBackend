const express = require('express')
const router = express.Router()
const db = require('../Connection')

router.post('/', async (req,res) =>{
  const {data} = req.body
  for (const item of data){
    const subtotal = item.harga * item.quantity
    await db.any(`insert into public.coba (menu_id, quantity, subtotal) values (${item.id}, ${item.quantity}, ${subtotal})`)
  };
  res.send("sukses")
  console.log("sukses")
})

module.exports = router;