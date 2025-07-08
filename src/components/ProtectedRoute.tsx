import { Navigate, Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { supabase } from "../../db/supabase";
import { User } from "@supabase/supabase-js";
import { CircularProgress } from "@mui/joy";

export default function ProtectedRoute() {

    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
            setLoading(false);
        });
    }, []);

    if (loading) return <CircularProgress color="primary" value={33} variant="plain" sx={{ width: "fit-content", margin: 'auto' }}/>

    return user ? <Outlet /> : <Navigate to="/login" replace />;
}
