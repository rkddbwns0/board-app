import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/authProvider.tsx';
import '../css/main.css';
import BoardTable from '../component/board_table.tsx';

const Main = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const logout = async () => {
        try {
            await axios.post('http://localhost:3001/auth/logout');
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            navigate('/');
        } catch (e) {
            console.error(e);
        }
    };

    const handlePost = () => {
        if (!user) {
            alert('로그인 후 이용해 주세요.');
            navigate('/login');
            return;
        }
        navigate('/post');
    };

    return (
        <div className="main-container">
            <div className="board-container">
                <div className="board-header">
                    <h4>게시판</h4>
                    <div className="user-info">
                        {user ? <h5>{user?.name}님</h5> : <h5>Guest</h5>}

                        <button className="write-post-button" onClick={handlePost}>
                            글쓰기
                        </button>
                        {user ? (
                            <button onClick={logout} className="logout-button">
                                로그아웃
                            </button>
                        ) : (
                            <button onClick={() => navigate('/login')} className="login-button">
                                로그인
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <BoardTable />
        </div>
    );
};

export default Main;
