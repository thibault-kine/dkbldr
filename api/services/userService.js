const { supabase } = require("./supabase");


async function getUserById(req, res) {    
    try {
        const userId = req.params.userId;
        
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();
    
        if (error) return res.status(500).json({ error: error.message });
    
        console.log("🔵 getUserById - 200");
        return res.status(200).json(data);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


module.exports = {
    getUserById
}