const { supabase } = require("../services/supabase")


async function createUser(req, res) {
    try {
        const { username, email, password } = req.body;

        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(password, salt);
    
        const { data, error } = await supabase
            .from("users")
            .insert([{ username, email, pass_hash: passwordHash }]);
        
        if (error) return res.status(500).json({ error: error.message });
            
        return res.status(201).json(data);
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
        
        return res.status(200).json(data);
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}


async function getUserById(req, res) {
    try {
        const userId = req.params.userId;

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) return res.status(500).json({ error: error.message });
        
        return res.status(200).json(data);
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}


async function updateUser(req, res) {
    try {
        const userId = req.params.userId;

        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId);
        
        if (error) return res.status(500).json({ error: error.message });
        
        return res.status(201).json(data);
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
            .eq('id', userId);
        
        if (error) throw error;
        
        return res.status(200).json(data);
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}


/* FOLLOW / UNFOLLOW STUFF */

async function followUser(req, res) {
    try {
        const { userId: currentUserId, targetId: targetUserId } = req.body; 

        const currentUser   = await getUserById(currentUserId);
        const targetUser    = await getUserById(targetUserId);
    
        if (!currentUser || !targetUser) throw new Error("Utilisateur non trouvé");
    
        if (currentUser.following.includes(targetUserId) || targetUser.followers.includes(currentUserId)) 
            return;
    
        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);
    
        await supabase.rpc('follow_user', {
            target_user_id: targetUser.id,
        });
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}


async function unfollowUser(req, res) {
    try {
        const targetUserId = req.body.userId;
    
        const { error } = await supabase.rpc("unfollow_user", {
            target_user_id: targetUserId,
        });

        if (error) return res.status(500).json({ error: error.message });
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}


module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,

    followUser,
    unfollowUser
}
