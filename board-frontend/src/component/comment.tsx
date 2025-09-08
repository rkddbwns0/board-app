import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/comment.css';
import { useAuth } from '../api/authProvider.tsx';

const Comments = ({ postId, writer_id }) => {
    const users = sessionStorage.getItem('user');
    const { user } = useAuth();
    const navigate = useNavigate();
    const [comments, setComments] = useState<any>({});
    const [newComment, setNewComment] = useState('');
    const [parentId, setParentId] = useState<number | null>(null);
    const [replyContent, setReplyContent] = useState('');

    const fetchComments = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:3001/post_comment/${postId}`);

            setComments(response.data.comment);
        } catch (e) {
            console.error(e);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleCommentSubmit = async (parentId: number | null = null) => {
        if (!user || !users) {
            alert('로그인 후 이용해 주세요.');
            navigate('/login');
            return;
        }

        const content = parentId ? replyContent : newComment;
        if (!content.trim()) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        try {
            await axios.post(
                'http://localhost:3001/post_comment',
                {
                    post_id: Number(postId),
                    user_id: JSON.parse(users!).user_id,
                    comment: content,
                    parent_id: parentId,
                },
                { headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` } }
            );

            if (parentId) {
                setReplyContent('');
                setParentId(null);
            } else {
                setNewComment('');
            }
            fetchComments();
        } catch (e) {
            console.error(e);
            alert(e.response?.data.message);
        }
    };

    const deleteComment = async (comment_id: number) => {
        try {
            await axios.delete(`http://localhost:3001/comment/${comment_id}`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` },
            });
            fetchComments();
        } catch (e) {
            console.error(e);
            alert(e.response?.data.message);
        }
    };

    const deleteAlert = (comment_id: number) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            deleteComment(comment_id);
        }
    };

    const replyComment = (comment_id: number) => {
        return (
            <div>
                <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="답글을 입력해 주세요."
                />
            </div>
        );
    };

    return (
        <div>
            <div>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력해 주세요."
                />
                <button onClick={() => handleCommentSubmit()}>답글</button>
            </div>
            {comments.length > 0 ? (
                <div>
                    {comments.map((comment: any) => (
                        <div key={comment.comment_id}>
                            <ul>
                                <span className="comment-writer">{comment.user_id.name}</span>
                                <span className="comment-content">{comment.comment}</span>
                                <span className="comment-date">{comment.date}</span>
                                <button
                                    onClick={() =>
                                        setParentId(parentId === comment.comment_id ? null : comment.comment_id)
                                    }
                                >
                                    답글
                                </button>
                                {comment.user_id.user_id === writer_id ? (
                                    <>
                                        <button onClick={() => deleteAlert(comment.comment_id)}>삭제</button>
                                    </>
                                ) : null}
                                {comment.children.length > 0 ? (
                                    <div>
                                        {comment.children.map((child: any) => (
                                            <ul key={child.comment_id}>
                                                <span className="comment-writer">{child.user_id.name}</span>
                                                <span className="comment-content">{child.comment}</span>
                                                <span className="comment-date">{child.date}</span>
                                            </ul>
                                        ))}
                                    </div>
                                ) : null}
                            </ul>
                            {parentId === comment.comment_id ? replyComment(comment.comment_id) : null}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default Comments;
