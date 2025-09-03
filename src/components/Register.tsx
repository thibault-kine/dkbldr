import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../db/supabase";
import "../style/Forms.css"
import { Box, Typography, Link, Input, Button } from "@mui/joy";
import { FaLock, FaPerson, FaRegEnvelope } from "react-icons/fa6";
import { FiLogIn } from "react-icons/fi";
import { usersApi } from "../services/api";
import { BASE_ROUTE } from "../router/AppRouter";

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
    
            // alert("Inscription réussie !");
            navigate(`${BASE_ROUTE}/login`);
        }
    }
    


    return (
        <div>
            <Box 
                className="account-form"
                component="form"
                onSubmit={handleRegister} 
            >
                <Typography level="h2" textAlign="center">Register</Typography>
                <Link href='/login' width="fit-content" m="auto">Already have an account?</Link>
                {error && <p style={{ color: "red" }}>{error}</p>}

                <Input
                    className="form-input"
                    type="text"
                    placeholder="Username"
                    value={username}
                    startDecorator={<FaPerson/>}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <Input
                    className="form-input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    startDecorator={<FaRegEnvelope/>}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    className="form-input"
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    startDecorator={<FaLock/>}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button 
                    className="form-btn"
                    type="submit"
                    variant="solid"
                    endDecorator={<FiLogIn size="20px"/>}
                >Register</Button>
            </Box>
        </div>
    )

}