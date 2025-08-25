import axios from 'axios';
import React, { createContext, useContext } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    user: any;
    loading: boolean;
    newAceessToken: () => Promise<void>;
    auth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    const newAceessToken = async () => {
        try {
            const refreshToken = Cookies.get('refresh_token');
            if (!refreshToken) {
                setUser(null);

                return;
            }

            const response = await axios.post(`http://localhost:3001/auth/refresh`, {}, { withCredentials: true });
            localStorage.setItem('access_token', response.data.access_token);
            return response.data.access_token;
        } catch (e) {
            console.log(e);
            setUser(null);
            console.error(e);
        }
    };

    const auth = async () => {
        let token = localStorage.getItem('access_token');

        if (!token) {
            token = await newAceessToken();
        }
        try {
            const response = await axios.get(`http://localhost:3001/auth`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            setUser(response.data);
        } catch (e) {
            console.log(e);
            await newAceessToken();
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        auth();
    }, []);

    return <AuthContext.Provider value={{ user, loading, newAceessToken, auth }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth 에러');
    }
    return context;
};
