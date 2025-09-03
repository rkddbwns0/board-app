import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/comment.css';
import { useAuth } from '../api/authProvider.tsx';

interface Comment {
    comment_id: number;
    post_id: number;
    witer_id: number;
    user_id: number;
    parent_comment: string;
    parent_created_at: string;
    작성자: string;
    parent_id: number | null;
    depth: number;
    children?: Comment[];
}

interface CommentProps {
    postId: string;
    writer_id: number;
}

const Comments: React.FC<CommentProps> = ({ postId, writer_id }) => {
    const users = localStorage.getItem('user');
    const { user } = useAuth();
    const navigate = useNavigate();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyContent, setReplyContent] = useState('');

    const fetchComments = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:3001/post_comment/${postId}`);

            setComments(response.data);
            console.log(response.data);
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
                { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
            );

            if (parentId) {
                setReplyContent('');
                setReplyingTo(null);
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
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
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

    const renderComment = (comment: Comment, writer_id: number) => (
        <li key={comment.comment_id} className={comment.depth > 0 ? 'reply-item' : 'comment-item'}>
            <div className="comment-header">
                <span className="comment-author">
                    {comment.작성자} {writer_id === comment.user_id ? '작성자' : ''}
                </span>
                <span className="comment-date">{comment.parent_created_at}</span>
            </div>
            <div className="comment-content">{comment.parent_comment}</div>
            <div className="comment-actions">
                {comment.parent_id === null && (
                    <button className="reply-button" onClick={() => setReplyingTo(comment.comment_id)}>
                        답글
                    </button>
                )}
                {user && users && JSON.parse(users).user_id === comment.user_id && (
                    <button className="comment-delete-button" onClick={() => deleteAlert(comment.comment_id)}>
                        삭제
                    </button>
                )}
            </div>

            {replyingTo === comment.comment_id && (
                <div className="reply-form-container">
                    <div className="reply-form">
                        <textarea
                            className="reply-textarea"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="대댓글을 입력하세요..."
                        />
                        <button className="reply-submit-button" onClick={() => handleCommentSubmit(comment.comment_id)}>
                            등록
                        </button>
                    </div>
                </div>
            )}

            {comment.children && comment.children.length > 0 && (
                <ul className="comment-list">{comment.children.map(renderComment)}</ul>
            )}
        </li>
    );

    return (
        <div className="comment-container">
            <h3>댓글</h3>
            <div className="comment-form">
                <textarea
                    className="comment-textarea"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                />
                <button className="comment-submit-button" onClick={() => handleCommentSubmit()}>
                    등록
                </button>
            </div>
            {comments.length > 0 && (
                <ul className="comment-list">{comments.map((comment) => renderComment(comment, writer_id))}</ul>
            )}
        </div>
    );
};

export default Comments;
