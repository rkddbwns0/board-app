import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/post.css';
import { useAuth } from '../api/authProvider.tsx';

const Post = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');

    const handleWritePost = async () => {
        if (!title || !content || !category) {
            alert('카테고리, 제목, 내용을 모두 입력해주세요.');
            return;
        }
        try {
            await axios.post(
                'http://localhost:3001/post',
                {
                    title: title,
                    content: content,
                    category_id: category,
                    writer: user.user_id,
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
            );
            navigate('/main');
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="post-container">
            <div className="post-form">
                <h4>글쓰기</h4>
                <div className="input-group">
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">카테고리 선택</option>
                        <option value="1">일상</option>
                        <option value="2">게임</option>
                        <option value="3">질문</option>
                        <option value="4">기타</option>
                    </select>
                </div>
                <div className="input-group">
                    <input type="text" placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="input-group">
                    <textarea placeholder="내용" value={content} onChange={(e) => setContent(e.target.value)} />
                </div>
                <button onClick={handleWritePost} className="submit-button">
                    등록
                </button>
            </div>
        </div>
    );
};

export default Post;
