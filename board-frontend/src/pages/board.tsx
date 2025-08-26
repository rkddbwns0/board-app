import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/board.css';

const Board = () => {
    const user = localStorage.getItem('user');
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<{
        카테고리: string;
        제목: string;
        내용: string;
        작성일: string;
        조회수: number;
        좋아요수: number;
        작성자: string;
        user_id: number;
    } | null>(null);

    const deletePost = async (post_id) => {
        try {
            const response = await axios.delete(`http://localhost:3001/post/${post_id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
            });
        } catch (e) {
            console.error(e);
            alert(e.response?.data.message);
            navigate('/main');
        }
    };

    const deleteAlert = (post_id) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            deletePost(post_id);
            navigate('/main');
        }
    };

    const fetchPost = useCallback(async () => {
        try {
            const params = user ? { user_id: JSON.parse(user).user_id } : {};
            const response = await axios.get(`http://localhost:3001/post/detail/${id}`, {
                params,
            });
            setPost(response.data);
        } catch (e) {
            console.error(e);
            alert(e.response?.data.message);
            navigate('/main');
        }
    }, [id, user, navigate]);

    useEffect(() => {
        fetchPost();
    }, []);

    if (!post) {
        return <div>로딩중...</div>;
    }

    return (
        <div className="board-view-container">
            <div className="board-view">
                <div className="board-view-header">
                    <h2>{post.제목}</h2>
                    <div className="post-meta">
                        <span>작성자: {post.작성자}</span>
                        <span>작성일: {post.작성일}</span>
                    </div>
                    <div className="post-meta" style={{ marginTop: '0.25rem', justifyContent: 'flex-end' }}>
                        <span>조회수: {post.조회수}</span>
                        <span style={{ marginLeft: '1rem' }}>좋아요: {post.좋아요수}</span>
                    </div>
                </div>
                <div className="board-view-content">
                    <textarea readOnly value={post.내용} style={{ lineHeight: '2' }}>
                        {post.내용}
                    </textarea>
                    <button className="like-button">좋아요👍🏻</button>
                </div>
                <div className="board-view-actions">
                    <button className="list-button" onClick={() => navigate('/main')}>
                        목록
                    </button>
                    {user && JSON.parse(user).user_id === post.user_id ? (
                        <div>
                            <button
                                className="edit-button"
                                onClick={() => navigate(`/postEdit/${id}`, { state: { post: post } })}
                            >
                                수정
                            </button>
                            <button className="delete-button" onClick={() => deleteAlert(id)}>
                                삭제
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Board;
