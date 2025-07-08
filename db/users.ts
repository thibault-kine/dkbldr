import bcrypt from "bcryptjs";
import { supabase } from "./supabase";
import { User } from "../src/context/UserContext";



export async function createUser(username: string, email: string, password: string) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const { data, error } = await supabase
        .from("users")
        .insert([{ username, email, pass_hash: passwordHash }]);
    
    if (error) throw error;

    return data;
}


export async function getUsers(): Promise<User[] | null> {
    const { data, error } = await supabase
        .from('users')
        .select("*");
    
    if (error) throw error;
    return data;
}


export async function getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) throw error;
    return data;
}


export async function updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id);
    
    if (error) throw error;
    return data;
}


export async function deleteUser(id: string) {
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
    
    if (error) throw error;
    return data;
}


/* FOLLOW / UNFOLLOW STUFF */

export async function followUser(currentUserId: string, targetUserId: string) {
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
}


export async function unfollowUser(targetUserId: string) {
    const { error } = await supabase.rpc("unfollow_user", {
        target_user_id: targetUserId,
    });

    if (error) {
        console.error("Erreur lors du unfollow :", error.message);
        throw new Error("Unfollow échoué");
    }
}
