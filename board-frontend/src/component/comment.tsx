import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/comment.css';

interface Comment {
    comment_id: number;
    post_id: number;
    user_id: number;
    parent_comment: string;
    parent_created_at: string;
    작성자: string;
    parent_id: number | null;
    depth: number;
    replies?: Comment[];
}

interface CommentProps {
    postId: string;
}

const Comments: React.FC<CommentProps> = ({ postId }) => {
    const user = localStorage.getItem('user');
    const navigate = useNavigate();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyContent, setReplyContent] = useState('');

    const fetchComments = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:3001/post_comment/${postId}`);
            const flatComments = response.data;
            console.log(response.data);
            const commentMap: { [key: number]: Comment } = {};
            const rootComments: Comment[] = [];

            flatComments.forEach((comment: Comment) => {
                comment.replies = [];
                commentMap[comment.comment_id] = comment;
                if (comment.parent_id) {
                    if (commentMap[comment.parent_id]) {
                        commentMap[comment.parent_id].replies?.push(comment);
                    }
                } else {
                    rootComments.push(comment);
                }
            });

            setComments(rootComments);
        } catch (e) {
            console.error(e);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleCommentSubmit = async (parentId: number | null = null) => {
        if (!user) {
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
                    user_id: JSON.parse(user!).user_id,
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

    const renderComment = (comment: Comment) => (
        <li key={comment.comment_id} className={comment.depth > 0 ? 'reply-item' : 'comment-item'}>
            <div className="comment-header">
                <span className="comment-author">{comment.작성자}</span>
                <span className="comment-date">{comment.parent_created_at}</span>
            </div>
            <div className="comment-content">{comment.parent_comment}</div>
            <div className="comment-actions">
                {comment.depth === 0 && (
                    <button className="reply-button" onClick={() => setReplyingTo(comment.comment_id)}>
                        답글
                    </button>
                )}
                {user && JSON.parse(user).user_id === comment.user_id && (
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

            {comment.replies && comment.replies.length > 0 && (
                <ul className="comment-list">{comment.replies.map(renderComment)}</ul>
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
            <ul className="comment-list">{comments.map(renderComment)}</ul>
        </div>
    );
};

export default Comments;
