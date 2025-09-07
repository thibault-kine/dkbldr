import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabase } from "../../db/supabase";
import { Button, Link, Input, Box, Typography } from "@mui/joy";
import { FiLogIn } from "react-icons/fi";
import { FaLock, FaRegEnvelope } from "react-icons/fa6";
import "../style/Forms.css";
import { useUser } from "../context/UserContext";
import { usersApi } from "../services/api";

export default function Login() {

    const { setUser } = useUser();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        const supabase = await getSupabase();
        
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) {
            setError(error.message);
            return;
        }
        
        const { user, session } = data;

        // Stocker le JWT dans sessionStorage
        if (session?.access_token) {
            session.user = user;
            sessionStorage.setItem("jwt", session.access_token);
            console.log("jwt:", sessionStorage.getItem("jwt"));
            
        }

        const appUser = await usersApi.getById(user.id);
        setUser(appUser);
        navigate(`/`);
    }


    return (
        <div>
            <Box
                className="account-form"
                component='form'
                onSubmit={(e) => handleLogin(e)}
            >
                <Typography level="h2" textAlign="center">Login</Typography>
                <Link href="/register" width="fit-content" m="auto">First time here?</Link>
                {error && <p style={{ color: "red" }}>{error}</p>}

                <Input
                    id="login-email"
                    className="form-input"
                    startDecorator={<FaRegEnvelope />}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    id="login-pwd"
                    className="form-input"
                    startDecorator={<FaLock />}
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
                    endDecorator={<FiLogIn size="20px" />}
                >Log In</Button>
            </Box>
        </div>
    )

}