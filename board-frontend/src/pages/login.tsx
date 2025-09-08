import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';
import { useAuth } from '../api/authProvider.tsx';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const { auth } = useAuth();

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                `http://localhost:3001/auth`,
                {
                    email: email,
                    password: password,
                },
                { withCredentials: true }
            );
            if (response.status === 201) {
                sessionStorage.setItem('access_token', response.data);
                await auth();
                navigate('/main');
            }
        } catch (e) {
            alert(e.response?.data.message);
            console.error(e);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h4>로그인</h4>
                <div className="input-group">
                    <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button onClick={handleLogin} className="login-button">
                    로그인
                </button>
                <div className="signup-link">
                    <a href="/signup">회원가입</a>
                </div>
            </div>
        </div>
    );
};
export default Login;
