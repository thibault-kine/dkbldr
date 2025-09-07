const express = require("express")
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
    })
})

export default router;