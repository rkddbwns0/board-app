import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');

    const handleDupEmail = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/users`, {
                params: {
                    email,
                },
            });
            if (response.status === 200) {
                alert(response.data.message);
            }
        } catch (e) {
            alert(e.response.data.message);
            console.error(e);
        }
    };

    const handleSignup = async () => {
        if (email === '' || password === '' || name === '') {
            alert('회원 정보를 모두 입력해 주세요.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3001/users', {
                email,
                password,
                name,
            });

            if (response.status === 200) {
                alert(response.data.message);
                navigate('/');
            }
        } catch (e) {
            alert(e.response.data.message);
            console.error(e);
        }
    };

    return (
        <div>
            <div>
                <h4>회원가입</h4>
            </div>
            <div>
                <input placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button onClick={handleDupEmail}>이메일중복확인</button>
                <input placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />

                <input placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <button onClick={handleSignup}>회원가입</button>
            </div>
        </div>
    );
};
export default Signup;
