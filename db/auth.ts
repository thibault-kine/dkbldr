import bcrypt from "bcryptjs";
import { supabase } from "./supabase";

export async function login(email: string, password: string) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
    if (error || !data) throw new Error("User not found");

    const pwdMatch = bcrypt.compareSync(password, data.pass_hash);
    if (!pwdMatch) throw new Error("Wrong password");

    const {
        data: tokenData,
        error: tokenError
    } = await supabase.auth.signInWithPassword({ email, password });
    if (tokenError) throw tokenError;


    sessionStorage.setItem('jwt', tokenData.session?.access_token || "");
    return tokenData.user;
}


export async function logout() {
    await supabase.auth.signOut();
    sessionStorage.removeItem('jwt');
}


export const isLoggedIn = () => sessionStorage.getItem('jwt')