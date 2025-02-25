import bcrypt from "bcryptjs";
import { supabase } from "./supabase";


export async function createUser(username: string, email: string, password: string) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const { data, error } = await supabase
        .from("users")
        .insert([{ username, email, pass_hash: passwordHash }]);
    
    if (error) throw error;

    return data;
}


export async function getUsers() {
    const { data, error } = await supabase
        .from('users')
        .select("*");
    
    if (error) throw error;
    return data;
}


export async function getUserById(id: string) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) throw error;
    return data;
}


export async function updateUser(id: string, username?: string, email?: string, password?: string) {
    let updates: { 
        username?: string,
        email?: string, 
        pass_hash?: string 
    } = {};

    if (username)   updates.username = username;
    if (email)      updates.email = email;
    if (password)   {
        const salt = bcrypt.genSaltSync(10);
        updates.pass_hash = bcrypt.hashSync(password, salt);
    }

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


export async function uploadProfilePicture(file: File, id: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${id}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload du fichier
    const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

    if (error) {
        console.error("Erreur d'upload: ", error.message);
        return null;
    }

    // Récupération de l'URL publique
    const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

    // console.log("public url = ", data.publicUrl);

    return data.publicUrl;
}


export async function updateProfilePicture(id: string, url: string) {
    const { error } = await supabase
        .from('users')
        .update({ pfp: url })
        .eq('id', id);

    if (error) {
        console.error("Erreur de mise à jour: ", error.message);
    }
}