import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Signup from './pages/Signup';
import WriteItem from './pages/WriteItem';
import ItemDetail from './pages/ItemDetail';
import FindAccount from './pages/FindAccount';

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
                <Route path="/find-account" element={<FindAccount />} />
            </Routes>

            {/* ★ Footer 추가 */}
            <footer style={{ marginTop: '100px', padding: '40px', borderTop: '1px solid #eee', textAlign: 'center', color: '#999', fontSize: '12px' }}>
                <p>© 2025 CAMPUS LOST & FOUND. All rights reserved.</p>
                <p>Created by <strong>차기환</strong> (Dept. of AISoftware)</p>
            </footer>
        </BrowserRouter>
    );
}

// 메인 화면 (Home 컴포넌트)
function Home() {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    // 페이지네이션
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async (searchKeyword = '') => {
        try {
            // ★ 본인 IP 확인 필수
            const res = await axios.get('http://192.168.24.186:8081/api/items', {
                params: { keyword: searchKeyword }
            });
            setItems(res.data);
            setCurrentPage(1);
        } catch (err) { console.log(err); }
    };

    const handleSearch = (e) => { if (e.key === 'Enter') fetchItems(keyword); };
    const onSearchClick = () => fetchItems(keyword);
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const filteredItems = items.filter(item => {
        if (filter === 'ALL') return true;
        if (filter === 'MY') {
            return currentUser && item.writer?.username === currentUser.username;
        }
        return item.itemType === filter;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const handlePageChange = (n) => { setCurrentPage(n); window.scrollTo(0, 0); };

    return (
        <div className="main-container">

            {/* Hero Section */}
            <div className="hero-section">
                <h1 className="hero-title">내 에어팟... 혹시 여기?</h1>
                <p className="hero-subtitle">캠퍼스의 모든 분실물, 여기서 쉽고 빠르게 찾아보세요.</p>

                <button
                    onClick={() => navigate('/write')}
                    style={{
                        marginTop: '30px',
                        padding: '15px 40px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#e65100',
                        backgroundColor: 'white',
                        border: '2px solid white',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        boxShadow: '0 5px 15px rgba(230, 81, 0, 0.2)',
                        transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#e65100';
                        e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = '#e65100';
                    }}
                >
                    + 분실물 등록하기
                </button>
            </div>

            {/* 검색창 */}
            <div className="search-container">
                <input type="text" className="search-input" placeholder="SEARCH (제목, 내용)"
                       value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={handleSearch}
                />
                <button className="search-btn" onClick={onSearchClick}>🔍</button>
            </div>

            {/* 필터 탭 */}
            <div className="filter-menu">
                <button className={filter === 'ALL' ? 'active' : ''} onClick={() => {setFilter('ALL'); setCurrentPage(1);}}>ALL</button>
                <button className={filter === 'LOST' ? 'active' : ''} onClick={() => {setFilter('LOST'); setCurrentPage(1);}}>잃어버렸어요😢</button>
                <button className={filter === 'FOUND' ? 'active' : ''} onClick={() => {setFilter('FOUND'); setCurrentPage(1);}}>제가 찾았습니다🔍</button>
                {currentUser && (
                    <button
                        className={filter === 'MY' ? 'active' : ''}
                        onClick={() => {setFilter('MY'); setCurrentPage(1);}}
                        style={{ marginLeft: '10px', color: '#e65100', borderColor: '#e65100' }}
                    >
                        🙋‍♂️ 내가 쓴 글
                    </button>
                )}
            </div>

            {/* 아이템 그리드 */}
            <div className="grid-container">
                {currentItems.length === 0 && (
                    <p style={{ textAlign: 'center', width: '100%', color: '#999', marginTop: '50px', gridColumn: '1 / -1' }}>
                        결과가 없습니다.
                    </p>
                )}

                {currentItems.map(item => (
                    <div key={item.id} className="card" onClick={() => navigate(`/items/${item.id}`)}>

                        {/* 1. 이미지 영역 */}
                        <div className="card-image">
                            {item.imagePath ? (
                                <img src={`http://192.168.24.186:8081/images/${item.imagePath}`} alt="item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span>{item.title.substring(0, 1)}</span>
                            )}

                            {/* ★ [변경] 태그를 이미지 왼쪽 상단에 오버레이로 배치 */}
                            <span className={`tag-badge ${item.itemType === 'LOST' ? 'lost' : 'found'} card-tag-overlay`}>
                                {item.itemType}
                            </span>

                            {/* SOLVED 오버레이 */}
                            {item.status === 'DONE' && <div className="card-solved-overlay">SOLVED</div>}
                        </div>

                        {/* 2. 제목 영역 */}
                        <h3 className={`card-title ${item.status === 'DONE' ? 'done-text' : ''}`} style={{ textAlign:'left', padding:'0 10px', marginTop:'15px' }}>
                            {item.title}
                        </h3>

                        {/* 3. 하단 정보 영역 (작성자/날짜 + 댓글 개수) */}
                        <div style={{
                            padding: '0 10px 20px 10px',
                            marginTop: '10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: '#999',
                            fontSize: '13px'
                        }}>
                            {/* 왼쪽: 작성자 및 날짜 */}
                            <span>
                                {item.writer?.name} · {new Date(item.regDate).toLocaleDateString()}
                            </span>

                            {/* ★ [변경] 댓글 개수를 오른쪽 끝으로 이동 */}
                            {item.commentCount > 0 && (
                                <span style={{
                                    fontWeight:'bold',
                                    color:'#e65100',
                                    display:'flex',
                                    alignItems:'center',
                                    gap:'4px',
                                    backgroundColor:'#fff3e0',
                                    padding:'2px 8px',
                                    borderRadius:'10px'
                                }}>
                                     💬 {item.commentCount}
                                 </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 0 && (
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button key={i + 1} onClick={() => handlePageChange(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;