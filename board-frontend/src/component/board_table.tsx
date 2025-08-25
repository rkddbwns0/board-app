import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/main.css';

const BoardTable = () => {
    const [categories, setCategories] = useState<{ category_id: number; category: string }[]>([]);
    const [posts, setPosts] = useState<
        {
            게시글번호: number;
            카테고리: string;
            제목: string;
            작성일: string;
            조회수: number;
            좋아요수: number;
            작성자: string;
        }[]
    >([]);
    const [activeCategoryId, setActiveCategoryId] = useState<number>(0);

    const getCategorys = async () => {
        try {
            const response = await axios.get('http://localhost:3001/category');
            setCategories([{ category_id: 0, category: '전체' }, ...response.data]);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        getCategorys();
        getPosts(0);
    }, []);

    const getPosts = async (category_id: number) => {
        try {
            setActiveCategoryId(category_id);
            const response = await axios.get(`http://localhost:3001/post/${category_id}`);
            setPosts(response.data);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="board-container">
            <div className="category-tabs">
                {categories.map((category) => (
                    <button
                        key={category.category_id}
                        className={`category-tab ${activeCategoryId === category.category_id ? 'active' : ''}`}
                        onClick={() => getPosts(category.category_id)}
                    >
                        {category.category}
                    </button>
                ))}
            </div>
            <table className="board-table">
                <thead>
                    <tr>
                        <th>카테고리</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                        <th>좋아요</th>
                        <th>조회수</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post) => (
                        <tr key={post.게시글번호}>
                            <td>{post.카테고리}</td>
                            <td>
                                <Link to={`/board/${post.게시글번호}`} style={{ textDecoration: 'none' }}>
                                    {post.제목}
                                </Link>
                            </td>
                            <td>{post.작성자}</td>
                            <td>{post.작성일}</td>
                            <td>{post.좋아요수}</td>
                            <td>{post.조회수}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BoardTable;
