const express = require("express");
const multer = require("multer");

const router = express.Router();

const pool = require("../Connection");
const supabase = require("../supabase");


const upload = multer({
    storage: multer.memoryStorage()
});


router.post(
    "/",
    upload.single("image"),
    async (req,res)=>{

        try{

            const {
                name,
                price,
                description,
                type
            } = req.body;

            const file = req.file;

            let imageUrl = null;


            if(file){

                const fileName =
                `${Date.now()}-${file.originalname}`;

                const {
                    error
                } =
                await supabase.storage
                .from("gambar_menu")
                .upload(
                    fileName,
                    file.buffer,
                    {
                        contentType:
                        file.mimetype
                    }
                );

                if(error){

                    throw error;

                }

                const { data } =
                supabase.storage
                .from("gambar_menu")
                .getPublicUrl(
                    fileName
                );

                imageUrl =
                data.publicUrl;

            }


            const result =
            await pool.query(
                `
                INSERT INTO cobamenu
                (
                    name,
                    price,
                    description,
                    type,
                    image_url
                )
                VALUES
                ($1,$2,$3,$4,$5)
                `,
                [
                    name,
                    price,
                    description,
                    type,
                    imageUrl
                ]
            );

            res.status(201)
            .json({
                success:true
            });

        }
        catch(error){

            console.log(error);

            res.status(500)
            .json({
                success:false,
                message:"Create menu failed"
            });

        }

    }
);

module.exports = router;