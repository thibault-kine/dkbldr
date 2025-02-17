import React, { useState } from "react";
import { login, logout } from "../../db/auth";
import { createUser } from "../../db/users";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../db/supabase";

export default function Register() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
    
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username }
            }
        });
    
        if (error) {
            setError(error.message);
        } else {
            const user = data.user;
            if (user) {
                await supabase.from("users").insert([
                    { id: user.id, username, email }
                ]);
            }
    
            alert("Inscription réussie !");
            navigate(`/login`);
        }
    }
    


    return (
        <div>
            <h2>Register</h2>
            <Link to='/login'>Already have an account?</Link>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
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
                <button type="submit">Register</button>
            </form>
        </div>
    )

}