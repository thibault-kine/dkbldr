import React, { useState } from "react";
import { login, logout } from "../../db/auth";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../db/supabase";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
    
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
    
        if (error) {
            setError(error.message);
        } else {
            const user = data.user;
            if (user) {
                const { data: userData } = await supabase
                    .from("users")
                    .select("username")
                    .eq("id", user.id)
                    .single();
    
                const username = userData?.username;
    
                // alert("Connexion réussie !");
                navigate(`/user/${username}/${user.id}`);
            }
        }
    }    


    return (
        <div>
            <h2>Login</h2>
            <Link to="/register">First time here?</Link>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Se connecter</button>
            </form>
            <button onClick={logout}>Se déconnecter</button>
        </div>
    )

}