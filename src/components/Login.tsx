import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../db/supabase";
import { Button, Link, Input, Box, Typography } from "@mui/joy";
import { FiLogIn } from "react-icons/fi";
import { FaLock, FaRegEnvelope } from "react-icons/fa6";
import "../style/Forms.css";
 
export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
        if (error) {
            setError(error.message);
        } else {
            const { user, session } = data;
    
            // Stocker le JWT dans sessionStorage
            if (session?.access_token) {
                sessionStorage.setItem("jwt", session.access_token);
            }
    
            // alert("Login successful");
            // navigate(`/user/${username}/${user.id}`);
            navigate(`/`);
        }
    }


    return (
        <div>
            <Box 
                className="account-form"
                component='form' 
                onSubmit={handleLogin}
            >
                <Typography level="h2" textAlign="center">Login</Typography>
                <Link href="/register" width="fit-content" m="auto">First time here?</Link>
                {error && <p style={{ color: "red" }}>{error}</p>}
                
                <Input
                    className="form-input"
                    startDecorator={<FaRegEnvelope/>}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    className="form-input"
                    startDecorator={<FaLock/>}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button 
                    className="form-btn"
                    type="submit"
                    variant="solid"
                    endDecorator={<FiLogIn size="20px"/>}
                >Log In</Button>
            </Box>
        </div>
    )

}