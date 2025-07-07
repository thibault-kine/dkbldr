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


export async function updateUser(
    id: string, 
    updates: Partial<User>
) {
    let _updates: Partial<User> = {};

    _updates = updates;

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

