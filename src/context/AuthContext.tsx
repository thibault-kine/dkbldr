import { Session, User } from "@supabase/supabase-js";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { supabase } from "../../db/supabase";


interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null, session: null, loading: true
});


export function AuthProvider({ children }: { children: ReactNode }) {

    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const setSessionFromSupabase = async () => {            
            const {
                data: { session },
                error
            } = await supabase.auth.getSession();
            
            if (!error && session) {
                setSession(session);
                setUser(session.user);
            }
            
            setLoading(false);
        };
        
        setSessionFromSupabase();
        
            const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
            });
            return () => {
                listener.subscription.unsubscribe();
            }
    }, []);


    return (
        <AuthContext.Provider value={{ user, session, loading }}>
            {children}
        </AuthContext.Provider>
    )
}


export function useAuth() {
    return useContext(AuthContext);
}