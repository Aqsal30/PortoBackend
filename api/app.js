const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json());
app.use(cors())
const PORT = process.env.PORT || 5000;
const db = require('./Connection')
const response = require('./response')

app.get('/', (req, res) => {
  res.status(200).json({
    data: "ini data",
    message: "ini pesan"
  })
})

app.get('/cek', async (req,res) => {
    const sql = await db.any('SELECT * FROM menu')
    res.json(sql)
})

app.get('/coba', async (req,res) =>{
  const sql = await db.one('SELECT harga from menu where menu_id = 2')
  console.log(sql.harga)
  res.json(sql)
})

app.post('/posting', async (req,res) =>{
  const {data} = req.body
  for (const item of data){
    const subtotal = item.harga * item.quantity
    await db.any(`insert into coba (menu_id, quantity, subtotal) values (${item.id}, ${item.quantity}, ${subtotal})`)
  };
  res.send("sukses")
  console.log("sukses")
})

app.post('/posted', async (req,res)=>{
  try {
    const {data,nama} = req.body
    let total = 0
    const order_item = []

    if (!data || data.length == 0) {
    return res.status(400).send("cart kosong")
    } 
    for (const item of data){
      const hargadb = await db.one(`select harga from menu where menu_id = $1`, [item.id])
      const sub = hargadb.harga * item.quantity
      total = total + sub
      order_item.push({
        id:item.id,
        qty:item.quantity,
        subtotal:sub
      }) 
    }

    const order = await db.one(`insert into orders (customer_name, total) values ($1,$2) returning order_id`, [nama,total])

    for (const items of order_item) {
      await db.none(`insert into order_items (menu_id, order_id, quantity, subtotal) values ($1, $2, $3, $4)`, [items.id, order.order_id, items.qty, items.subtotal])
    }
    res.send("berhasil")
    console.log(data)
} catch(err) {
    res.status(500).send("gagal")
}
})

module.exports = app;