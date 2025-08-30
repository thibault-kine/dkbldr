const bcrypt = require("bcryptjs")
const { supabase } = require("../services/supabase");
const { validate: isUuid } = require("uuid");


async function createUser(req, res) {
    try {
        const { username, email, password } = req.body;

        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(password, salt);
    
        const { data, error } = await supabase
            .from("users")
            .insert([{ username, email, pass_hash: passwordHash }])
            .select();
        
        if (error) return res.status(500).json({ error: error.message });
            
        console.log("🔵 createUser - 201");
        return res.status(201).json(data[0]); 
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}


async function getUsers(req, res) {
    try {
        const { data, error } = await supabase
        .from('users')
        .select("*");
        
        if (error) return res.status(500).json({ error: error.message });
        
        console.log("🔵 getUsers - 200");
        return res.status(200).json(data);
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}


async function updateUser(req, res) {
    try {
        const userId = req.params.userId;
        const updates = req.body;
        
        const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select();
        
        if (error) return res.status(500).json({ error: error.message });
        
        // Vérifier si l'utilisateur a été trouvé et mis à jour
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        
        console.log("🔵 updateUser - 200");
        return res.status(200).json(data[0]); 
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}


async function deleteUser(req, res) {
    try {
        const userId = req.params.userId;
        
        const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)
        .select();
        
        if (error) return res.status(500).json({ error: error.message });
        
        // Vérifier si l'utilisateur a été trouvé et supprimé
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        
        console.log("🔵 deleteUser - 200");
        return res.status(200).json({ message: "Utilisateur supprimé", user: data[0] });
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}


/* FOLLOW / UNFOLLOW STUFF */

async function followUser(req, res) {
    try {
        const { userId: currentUserId, targetId: targetUserId } = req.body; 
        
        if (!isUuid(currentUserId) || !isUuid(targetUserId))
            return res.status(400).json({ error: "UUID invalide" });
        
        const currentUser   = await getUserById(currentUserId);
        const targetUser    = await getUserById(targetUserId);
        
        if (!currentUser || !targetUser) 
            return res.status(404).json({ error: "Utilisateur non-trouvé" });
        
        if (currentUser.following.includes(targetUserId) || targetUser.followers.includes(currentUserId)) 
            return res.status(409).json({ error: "Utilisateur déjà suivi" });
    
        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);
        
        await supabase.rpc('follow_user', {
            target_user_id: targetUser.id,
        });
        
        console.log("🔵 followUser - 200");
        return res.status(200).json({ success: true });
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}


async function unfollowUser(req, res) {
    try {
        const targetUserId = req.body.userId;

        if (!isUuid(targetUserId))
            return res.status(400).json({ error: "UUID invalide" });
        
        const { error } = await supabase.rpc("unfollow_user", {
            target_user_id: targetUserId,
        });
        
        if (error) return res.status(500).json({ error: error.message });
        
        console.log("🔵 unfollowUser - 200");
        return res.status(200).json({ success: true });
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}


module.exports = {
    createUser,
    getUsers,
    updateUser,
    deleteUser,

    followUser,
    unfollowUser
}
