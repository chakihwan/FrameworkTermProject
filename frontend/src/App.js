import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Signup from './pages/Signup';
import WriteItem from './pages/WriteItem';
import ItemDetail from './pages/ItemDetail';
import './App.css';

function App() {
    // 로그인 상태 관리 (Navbar 갱신을 위해 App 레벨에서 관리하거나, localStorage를 직접 읽음)
    // 여기서는 간단하게 localStorage를 읽어서 렌더링하도록 처리
    const user = JSON.parse(localStorage.getItem('user'));

    // 로그아웃 핸들러
    const handleLogout = () => {
        localStorage.removeItem('user');
        alert('로그아웃 되었습니다.');
        window.location.href = '/'; // 새로고침하여 상태 초기화
    };

    return (
        <BrowserRouter>
            {/* 상단 네비게이션바 */}
            <nav className="navbar">
                <Link to="/" className="logo">CAMPUS LOST & FOUND</Link>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/write">분실물등록</Link>

                    {/* ★ 핵심 변경: 로그인 여부에 따라 메뉴가 다르게 보임 */}
                    {user ? (
                        <>
                            {/* 로그인 했을 때 */}
                            <span className="nav-user">{user.name}님</span>
                            <span className="nav-btn" onClick={handleLogout}>LOGOUT</span>
                        </>
                    ) : (
                        <>
                            {/* 로그인 안 했을 때 */}
                            <Link to="/login">Login</Link>
                            <Link to="/signup">Join</Link>
                        </>
                    )}
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/write" element={<WriteItem />} />
                <Route path="/items/:id" element={<ItemDetail />} />
            </Routes>
        </BrowserRouter>
    );
}

// 메인 화면
function Home() {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('ALL'); // 필터 상태: ALL, LOST, FOUND
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8081/api/items')
            .then(res => setItems(res.data))
            .catch(err => console.log(err));
    }, []);

    // 필터링된 목록 계산
    const filteredItems = items.filter(item => {
        if (filter === 'ALL') return true;
        return item.itemType === filter;
    });

    return (
        <div>
            {/* ★ 변경: 탭 메뉴 (ALL | LOST | FOUND) */}
            <div className="filter-menu">
                <button
                    className={filter === 'ALL' ? 'active' : ''}
                    onClick={() => setFilter('ALL')}
                >
                    ALL
                </button>
                <button
                    className={filter === 'LOST' ? 'active' : ''}
                    onClick={() => setFilter('LOST')}
                >
                    LOST (분실)
                </button>
                <button
                    className={filter === 'FOUND' ? 'active' : ''}
                    onClick={() => setFilter('FOUND')}
                >
                    FOUND (습득)
                </button>
            </div>

            <div className="grid-container">
                {filteredItems.length === 0 && (
                    <p style={{ textAlign: 'center', width: '100%', color: '#999', marginTop: '50px' }}>
                        등록된 게시물이 없습니다.
                    </p>
                )}

                {filteredItems.map(item => (
                    <div key={item.id} className="card" onClick={() => navigate(`/items/${item.id}`)}>
                        <div className="card-image">
                            <span>{item.title.substring(0, 1)}</span>
                            {item.status === 'DONE' && (
                                <div className="solved-overlay">SOLVED</div>
                            )}
                        </div>

                        <div>
              <span className={`tag ${item.itemType === 'LOST' ? 'lost' : 'found'}`}>
                {item.itemType}
              </span>
                        </div>

                        <h3 className={`card-title ${item.status === 'DONE' ? 'done-text' : ''}`}>
                            {item.title}
                        </h3>

                        <p className="card-info">{new Date(item.regDate).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;