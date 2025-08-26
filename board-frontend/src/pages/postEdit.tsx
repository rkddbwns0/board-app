import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../css/post.css';
import { useAuth } from '../api/authProvider.tsx';

const PostEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const postData = location.state?.post;
        if (postData) {
            setTitle(postData.제목);
            setContent(postData.내용);
            setCategory(postData.카테고리);
            setLoading(false);
        } else {
            const fetchPost = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/post/detail/${id}`);
                    const post = response.data;
                    setTitle(post.제목);
                    setContent(post.내용);
                    setCategory(post.카테고리);
                } catch (error) {
                    console.error('Failed to fetch post:', error);
                    alert('게시글을 불러오는데 실패했습니다.');
                    navigate('/main');
                } finally {
                    setLoading(false);
                }
            };
            fetchPost();
        }
    }, [id, navigate, location.state]);

    const handleUpdatePost = async () => {
        if (!title || !content || !category) {
            alert('카테고리, 제목, 내용을 모두 입력해주세요.');
            return;
        }
        try {
            await axios.put(
                `http://localhost:3001/post/${id}`,
                {
                    title: title,
                    content: content,
                    writer: user.user_id,
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
            );
            alert('게시글을 수정하였습니다.');
            navigate('/main');
        } catch (e) {
            console.error(e);
            alert('게시글 수정에 실패했습니다.');
        }
    };

    if (loading) {
        return <div>로딩중...</div>;
    }

    return (
        <div className="post-container">
            <div className="post-form">
                <h4>게시글 수정</h4>
                <div className="input-group">
                    <select value={category} onChange={(e) => setCategory(e.target.value)} disabled>
                        <option value="">카테고리 선택</option>
                        <option value="일상">일상</option>
                        <option value="게임">게임</option>
                        <option value="질문">질문</option>
                        <option value="기타">기타</option>
                    </select>
                </div>
                <div className="input-group">
                    <input type="text" placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="input-group">
                    <textarea placeholder="내용" value={content} onChange={(e) => setContent(e.target.value)} />
                </div>
                <button onClick={handleUpdatePost} className="submit-button">
                    수정
                </button>
            </div>
        </div>
    );
};

export default PostEdit;
