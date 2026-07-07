const express = require('express')
const router = express.Router()
const db = require('../../Connection')

router.post('/', async (req,res)=>{
  try {
    const {data,nama} = req.body
    let total = 0
    const order_item = []

    if (!data || data.length == 0) {
    return res.status(400).send("cart kosong")
    } 
    for (const item of data){
      const hargadb = await db.one(`select harga from public.menu where menu_id = $1`, [item.id])
      const sub = hargadb.harga * item.quantity
      total = total + sub
      order_item.push({
        id:item.id,
        qty:item.quantity,
        subtotal:sub
      }) 
    }

    const order = await db.one(`insert into public.orders (customer_name, total) values ($1,$2) returning order_id`, [nama,total])

    for (const items of order_item) {
      await db.none(`insert into public.order_items (menu_id, order_id, quantity, subtotal) values ($1, $2, $3, $4)`, [items.id, order.order_id, items.qty, items.subtotal])
    }
    res.send("berhasil")
    console.log(data)
} catch(err) {
    res.status(500).send("gagal")
}
})

module.exports = router;