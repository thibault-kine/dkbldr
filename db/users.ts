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


export async function updateUser(
    id: string, 
    updates: Partial<{
        username: string;
        email: string;
        password: string;
        pfp: string;
        header_bg: string;
    }>
) {
    let _updates: { 
        username?: string;
        email?: string;
        pass_hash?: string;
        pfp?: string;
        headerBg?: string;
    } = {};

    if (updates.username)   _updates.username = updates.username;
    if (updates.email)      _updates.email = updates.email;
    if (updates.password)   {
        const salt = bcrypt.genSaltSync(10);
        _updates.pass_hash = bcrypt.hashSync(updates.password, salt);
    }
    if (updates.pfp)       _updates.pfp;
    if (updates.header_bg)  _updates.headerBg;


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

