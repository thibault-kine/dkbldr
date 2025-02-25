import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../db/supabase";
import { Button, Link, Input, Box, Typography } from "@mui/joy";
import { FiLogIn } from "react-icons/fi";
import { FaEnvelope } from "react-icons/fa";
import { FaLock, FaRegEnvelope } from "react-icons/fa6";
 
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
            const username = user?.user_metadata?.username || "Utilisateur";
    
            // Stocker le JWT dans sessionStorage
            if (session?.access_token) {
                sessionStorage.setItem("jwt", session.access_token);
            }
    
            // alert("Login successful");
            navigate(`/user/${username}/${user.id}`);
        }
    }


    return (
        <div>
            <Box 
                component='form' 
                onSubmit={handleLogin}
                sx={{ 
                    p: 2, 
                    border: '1px solid grey', 
                    width: '25%', 
                    m: 'auto',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-evenly'
                }}
            >
                <Typography level="h2" textAlign="center">Login</Typography>
                <Link href="/register" width="fit-content" m="auto">First time here?</Link>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <Input
                    startDecorator={<FaRegEnvelope/>}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    sx={{
                        border: '1px solid var(--lightgrey)',
                        m: '20px auto'
                    }}
                />
                <Input
                    startDecorator={<FaLock/>}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    sx={{
                        border: '1px solid var(--lightgrey)',
                        m: '0 auto 20px'
                    }}
                />
                <Button 
                    type="submit"
                    variant="solid"
                    endDecorator={<FiLogIn size="20px"/>}
                    sx={{width:"fit-content"}}
                >Log In</Button>
            </Box>
        </div>
    )

}