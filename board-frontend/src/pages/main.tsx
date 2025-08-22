import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/authProvider.tsx';

const Main = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const logout = async () => {
        try {
            const response = await axios.post('http://localhost:3001/auth/logout');
            navigate('/');
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <h4>메인임</h4>
            <button onClick={logout}>로그아웃</button>
        </div>
    );
};

export default Main;
