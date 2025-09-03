import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../db/supabase";
import { Button } from "@mui/joy";
import { BASE_ROUTE } from "../router/AppRouter";

export default function LogoutButton() {
    
    const [confirming, setConfirming] = useState(false);
    const [logoutBtnClass, setLogoutBtnClass] = useState("nav-btn logout-1");
    const [logoutBtnText, setLogoutBtnText] = useState("Logout");    

    const timeoutRef = useRef<number | null>(null);
    const navigate = useNavigate();

    async function handleLogout() {
        await supabase.auth.signOut();
        sessionStorage.removeItem("jwt");
        navigate(`${BASE_ROUTE}`);
        window.location.reload();
    }

    function handleClick() {
        if (confirming) {
            handleLogout();
        }
        else {
            setConfirming(true);
            setLogoutBtnClass("nav-btn logout-2");
            setLogoutBtnText("Press again to confirm");
            timeoutRef.current = window.setTimeout(() => {
                setConfirming(false);
                setLogoutBtnClass("nav-btn logout-1");
                setLogoutBtnText("Logout");
            }, 3000); // 3 secondes d'attente
        }
    }


    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }
    }, []);


    return (
        <Button
            onClick={handleClick}
            className={logoutBtnClass}
        >
            {logoutBtnText}
        </Button>
    )
}