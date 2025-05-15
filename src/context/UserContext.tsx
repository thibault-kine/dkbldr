import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../db/supabase";
import { getUserById } from "../../db/users";

export interface User {
    id: string;
    username: string;
    email: string;
    pfp?: string;
    headerBg?: string;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    refreshUser: () => Promise<void>;
}


const UserContext = createContext<UserContextType | undefined>(undefined);


export function UserProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | null>(null);

    async function fetchUser() {
        const { data: authUser, error } = await supabase.auth.getUser();

        if (error || !authUser.user) {
            setUser(null);
            return;
        }

        try {
            const userData = await getUserById(authUser.user.id);
            setUser(userData);
        } catch (err) {
            console.error("Erreur lors de la récupération du profil : ", err);
        }
    }

    useEffect(() => {

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                getUserById(session.user.id)
                    .then(userData => setUser(userData))
                    .catch(err => {
                        console.error("Erreur lors de la récupération du profil : ", err);
                        setUser(null);
                    });
            }
            else {
                setUser(null);
            }
        })

        fetchUser();

        return () => {
            authListener.subscription.unsubscribe();
        }
    }, []);


    return (
        <UserContext.Provider value={{ user, setUser, refreshUser: fetchUser }}>
            {children}
        </UserContext.Provider>
    )
}


export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error("useUser doit être utilisé dans un UserProvider");
    }

    return ctx;
}