const express = require("express");
const multer = require("multer");

const router = express.Router();

const db = require("../../Connection");
const supabase = require("../../supabase");

const upload = multer({
    storage: multer.memoryStorage()
});

router.get('/', async (req,res) => {
    const sql = await db.any(`SELECT public.menu.*,
  coalesce(

    json_agg(

        json_build_object(
            'option_id', public.menu_option.option_id,
            'label', public.menu_option.label,
            'value', public.menu_option.value

        )
    ) filter (where public.menu_option.option_id is not null), '[]' ::json

    ) AS option

FROM public.menu

LEFT JOIN public.menu_option
ON public.menu.menu_id = public.menu_option.menu_id

GROUP BY public.menu.menu_id

ORDER BY public.menu.menu_id`)

    res.json(sql)
})

router.get('/option', async (req,res) =>{
    const sql = await db.any('SELECT * FROM public.menu_option')
    res.json(sql)
})

router.put(
    "/image",
    upload.single("image"),
    async (req, res) => {

        try {

            const { menu_id } = req.body;
            const file = req.file;

            if (!menu_id) {
                return res.status(400).json({
                    success: false,
                    message: "menu_id is required"
                });
            }

            if (!file) {
                return res.status(400).json({
                    success: false,
                    message: "Image is required"
                });
            }

            const fileName = `${Date.now()}-${file.originalname}`;

            const { error } = await supabase.storage
                .from("gambar_menu")
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype
                });

            if (error) throw error;

            const { data } = supabase.storage
                .from("gambar_menu")
                .getPublicUrl(fileName);

            const imageUrl = data.publicUrl;

            await db.query(
                `
                UPDATE public.menu
                SET img_url = $1
                WHERE menu_id = $2
                `,
                [imageUrl, menu_id]
            );

            res.status(200).json({
                success: true,
                image_url: imageUrl
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                success: false,
                message: "Upload failed"
            });

        }

    }
);
module.exports = router;