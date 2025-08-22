import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

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
                localStorage.setItem('access_token', response.data);
                navigate('/main');
            }
        } catch (e) {
            alert(e.response?.data.message);
            console.error(e);
        }
    };

    return (
        <div>
            <h4>로그인</h4>
            <div>
                <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div>
                <button onClick={handleLogin}>로그인</button>
            </div>
            <a href="/signup">회원가입</a>
        </div>
    );
};
export default Login;
