import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../db/supabase";

export default function Profile() {

    const { username, id } = useParams();
    const [user, setUser] = useState<any>(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUser() {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) 
                navigate("/login");
            else
                setUser(user);
        }
        fetchUser();
    }, [id, navigate]);


    return (
        <div>
            <h1>Profil</h1>
            {user ? (
                <div>
                    <p><strong>Username :</strong> {username}</p>
                    <p><strong>Email :</strong> {user.email}</p>
                </div>
            ) : (
                <p>Chargement...</p>
            )}
        </div>
    )
}