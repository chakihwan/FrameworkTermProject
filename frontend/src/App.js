import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Signup from './pages/Signup';
import WriteItem from './pages/WriteItem';
import ItemDetail from './pages/ItemDetail';
import './App.css';

import logoImg from './lost_found_logo.png';

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
                {/* 로고 이미지 + 텍스트를 가로로 배치 (flex) */}
                <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '15px', textDecoration: 'none', color: '#000' }}>
                    <img
                        src={logoImg}
                        alt="Logo"
                        style={{ height: '70px', width: 'auto' }} // 로고 크기 조절
                    />
                    <span>CAMPUS LOST & FOUND</span>
                </Link>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/write">분실물등록</Link>

                    {/* 로그인 여부에 따라 메뉴가 다르게 보임 */}
                    {user ? (
                        <>
                            {/* 로그인 했을 때 */}
                            <span className="nav-user">{user.name}님</span>
                            <span className="nav-btn" onClick={handleLogout}>Logout</span>
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

            {/* ★ Footer 추가 */}
            <footer style={{ marginTop: '100px', padding: '40px', borderTop: '1px solid #eee', textAlign: 'center', color: '#999', fontSize: '12px' }}>
                <p>© 2025 CAMPUS LOST & FOUND. All rights reserved.</p>
                <p>Created by <strong>차기환</strong> (Dept. of AISoftware)</p>
            </footer>
        </BrowserRouter>
    );
}

// 메인 화면
function Home() {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    // ★ 페이지네이션 상태 추가
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // 한 페이지에 12개씩 (4열 x 3행)

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async (searchKeyword = '') => {
        try {
            const res = await axios.get('http://localhost:8081/api/items', {
                params: { keyword: searchKeyword }
            });
            setItems(res.data);
            setCurrentPage(1); // 검색하면 1페이지로 초기화
        } catch (err) {
            console.log(err);
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') fetchItems(keyword);
    };

    const onSearchClick = () => fetchItems(keyword);

    // 1. 필터링 먼저 적용
    const filteredItems = items.filter(item => {
        if (filter === 'ALL') return true;
        return item.itemType === filter;
    });

    // 2. 페이지네이션 계산 (필터링된 결과 내에서 자르기)
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    // 페이지 변경 함수
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0); // 페이지 넘기면 맨 위로 스크롤
    };

    return (
        <div>
            {/* Hero Section (배너) */}
            <div style={{
                background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                padding: '80px 20px', textAlign: 'center', marginBottom: '50px',
                borderRadius: '0 0 30px 30px', boxShadow: '0 10px 30px rgba(230, 81, 0, 0.1)'
            }}>
                <h1 style={{ fontSize: '42px', marginBottom: '15px', color:'#e65100', fontWeight:'900', letterSpacing:'1px', fontFamily:'sans-serif' }}>LOST & FOUND</h1>
                <p style={{ color: '#f57c00', fontSize: '18px', fontWeight:'500' }}>캠퍼스의 모든 분실물, 여기서 쉽고 빠르게 찾아보세요.</p>
            </div>

            {/* 검색창 */}
            <div className="search-container">
                <input
                    type="text" className="search-input" placeholder="SEARCH (제목, 내용)"
                    value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={handleSearch}
                />
                <button className="search-btn" onClick={onSearchClick}>🔍</button>
            </div>

            {/* 필터 탭 */}
            <div className="filter-menu">
                <button className={filter === 'ALL' ? 'active' : ''} onClick={() => {setFilter('ALL'); setCurrentPage(1);}}>ALL</button>
                <button className={filter === 'LOST' ? 'active' : ''} onClick={() => {setFilter('LOST'); setCurrentPage(1);}}>잃어버렸어요😢</button>
                <button className={filter === 'FOUND' ? 'active' : ''} onClick={() => {setFilter('FOUND'); setCurrentPage(1);}}>제가 찾았습니다🔍</button>
            </div>

            {/* 아이템 그리드 (4개씩 표시) */}
            <div className="grid-container">
                {currentItems.length === 0 && (
                    <p style={{ textAlign: 'center', width: '100%', color: '#999', marginTop: '50px', gridColumn: '1 / -1' }}>
                        결과가 없습니다.
                    </p>
                )}

                {currentItems.map(item => (
                    <div key={item.id} className="card" onClick={() => navigate(`/items/${item.id}`)}>
                        <div className="card-image">
                            {item.imagePath ? (
                                <img src={`http://localhost:8081/images/${item.imagePath}`} alt="item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span>{item.title.substring(0, 1)}</span>
                            )}
                            {item.status === 'DONE' && <div className="solved-overlay">SOLVED</div>}
                        </div>
                        <div><span className={`tag ${item.itemType === 'LOST' ? 'lost' : 'found'}`}>{item.itemType}</span></div>
                        <h3 className={`card-title ${item.status === 'DONE' ? 'done-text' : ''}`}>{item.title}</h3>
                        <p className="card-info">{new Date(item.regDate).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>

            {/* ★ 페이지네이션 버튼들 */}
            {totalPages > 0 && (
                <div className="pagination">
                    {/* 이전 버튼 (필요하면 주석 해제)
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
                    */}

                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={currentPage === i + 1 ? 'active' : ''}
                        >
                            {i + 1}
                        </button>
                    ))}

                    {/* 다음 버튼 (필요하면 주석 해제)
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</button>
                    */}
                </div>
            )}

            {/* 하단 여백 추가 */}
            <div style={{ marginBottom: '80px' }}></div>
        </div>
    );
}

export default App;