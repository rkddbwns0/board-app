import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/login.tsx';
import Signup from './pages/signup.tsx';
import Main from './pages/main.tsx';
import Post from './pages/post.tsx'; // Import Post component
import PrivateRoute from './api/privateRoute.tsx';
import { AuthProvider, useAuth } from './api/authProvider.tsx';
import Board from './pages/board.tsx';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Main />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route
                            path="/main"
                            element={
                                <PrivateRoute>
                                    <Main />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/post"
                            element={
                                <PrivateRoute>
                                    <Post />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/board/:id"
                            element={
                                <PrivateRoute>
                                    <Board />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
