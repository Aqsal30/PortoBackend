const express = require('express')
const router = express.Router()
const db = require('../../Connection')

router.get('/getorder', async (req,res) => {
    const sql = await db.any('SELECT * FROM public.order_items')
    res.json(sql)
})
router.post('/history', async(req,res)=>{
  try{
  const {OrderIds} = req.body
  const sql = await db.any(`SELECT
    public.order_items.order_id,
    public.orders.total,
    public.orders.status,
    to_char(
    public.orders."Created_at" AT TIME ZONE 'Asia/Jakarta',
    'DD/MM/YYYY HH24:MI') as "Created_at",

    json_agg(

        json_build_object(
            'nama_menu', public.menu.nama_menu,
            'quantity', public.order_items.quantity,
            'option', public.order_items.option_menu,
            'note', public.order_items.note

        )

    ) AS detail

FROM public.order_items

JOIN public.menu
ON public.menu.menu_id = public.order_items.menu_id

JOIN public.orders
ON public.orders.order_id = public.order_items.order_id

WHERE public.order_items.order_id = ANY($1)

GROUP BY public.order_items.order_id,
    public.orders.total,
    public.orders.status,
    public.orders."Created_at"

ORDER BY public.order_items.order_id asc
`, [OrderIds])
  console.log(OrderIds)
  res.json(sql)
  }catch(err){
    console.log(err)
  }
})
router.post('/orderpost', async (req,res)=>{
  try {
    const {data,nama} = req.body
    console.log(data)
    let total = 0
    const order_item = []

    if (!data || data.length == 0) {
    return res.status(400).send("cart kosong")
    } 
    for (const item of data){
      const hargadb = await db.one(`select harga from public.menu where menu_id = $1`, [item.menu_id])
      const sub = hargadb.harga * item.quantity
      total = total + sub
      order_item.push({
        menu_id:item.menu_id,
        qty:item.quantity,
        subtotal:sub,
        option:item.option,
        note: item.note
      }) 
    }

    const order = await db.one(`insert into public.orders (customer_name, total) values ($1,$2) returning order_id`, [nama,total])

    for (const items of order_item) {
      await db.none(`insert into public.order_items (menu_id, order_id, quantity, subtotal, option_menu, note) values ($1, $2, $3, $4, $5, $6)`, [items.menu_id, order.order_id, items.qty, items.subtotal, items.option, items.note])
    }
    console.log("uploaded")
    res.status(201).json({
      message: "Order Created",
      orderId: order.order_id
    })
} catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
})

module.exports = router;