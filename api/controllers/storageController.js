const { supabase } = require("../services/supabase")


async function uploadProfilePicture(req, res) {
    try {
        const file = req.file;
        const userId = req.params.userId;
        
        if (!file) return res.status(400).json({ error: "Aucun fichier reçu" });
        
        const extension = file.originalname.split(".").pop();
        const filePath = `${userId}/avatar_${Date.now()}.${extension}`;
        
        const { error } = await supabase.storage
            .from("profiles")
            .upload(filePath, file, { upsert: true });

        if (error) return res.status(500).json({ error: error.message });

        const { data } = await supabase.storage
            .from("profiles")
            .getPublicUrl(filePath);
            
        return res.status(200).json({ url: data.publicUrl });
    } catch(err) {
	    return res.status(500).json({ error: err.message });
    }
}


async function updateProfilePicture(req, res) {
    try {
        const userId = req.params.userId;
        const url = req.body.url;

        const { error } = await supabase
            .from('users')
            .update({ pfp: url })
            .eq('id', userId);

	    if (error) return res.status(500).json({ error: error.message });
        
	    return res.status(200);
    } catch(err) {
	    return res.status(500).json({ error: err.message });
    }
}


async function uploadHeaderBgImage(req, res) {
    try {
        const file = req.file;
        const userId = req.params.userId;
        
        if (!file) return res.status(400).json({ error: "Aucun fichier reçu" });
        
        const extension = file.originalname.split(".").pop();
        const filePath = `${userId}/header_${Date.now()}.${extension}`;
        
        const { error } = await supabase.storage
            .from("profiles")
            .upload(filePath, file, { upsert: true });

        if (error) return res.status(500).json({ error: error.message });

        const { data } = await supabase.storage
            .from("profiles")
            .getPublicUrl(filePath);
            
        return res.status(200).json({ url: data.publicUrl });
    } catch(err) {
	    return res.status(500).json({ error: err.message });
    }
}


async function updateHeaderBgImage(req, res) {
    try {
        const userId = req.params.userId;
        const url = req.body.url;

        const { error } = await supabase
            .from('users')
            .update({ header_bg: url })
            .eq('id', userId);

	    if (error) return res.status(500).json({ error: error.message });
        
	    return res.status(200);
    } catch(err) {
	    return res.status(500).json({ error: err.message });
    }
}


module.exports = {
    uploadProfilePicture,
    uploadHeaderBgImage,
    updateProfilePicture,
    updateHeaderBgImage
}