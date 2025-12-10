import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Signup from './pages/Signup';
import WriteItem from './pages/WriteItem';
import './App.css'; //  CSS 파일 연결

function App() {
  return (
      <BrowserRouter>
        {/* 상단 네비게이션바 */}
        <nav className="navbar">
          <Link to="/" className="logo">Campus Lost & Found</Link>
          <div className="nav-links">
            <Link to="/">Home</Link> {/* 느낌 살려서 SHOP 대신 HOME */}
            <Link to="/write">분실물등록</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">SignUp</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/write" element={<WriteItem />} />
        </Routes>
      </BrowserRouter>
  );
}

function Home() {
  const [items, setItems] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // 백엔드에서 데이터 가져오기
    axios.get('http://localhost:8081/api/items')
        .then(res => setItems(res.data))
        .catch(err => console.log(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
      <div>
        <div className="page-title">
          {user && (
              <div style={{fontSize: '12px', color: '#999', marginBottom: '15px'}}>
                WELCOME, {user.name} <span onClick={handleLogout} style={{cursor:'pointer', textDecoration:'underline'}}>(LOGOUT)</span>
              </div>
          )}
          <h2>LOST ITEMS COLLECTION</h2>
        </div>

        <div className="grid-container">
          {items.length === 0 ? <p style={{textAlign:'center', width:'100%', color:'#999'}}>등록된 물건이 없습니다.</p> : null}

          {items.map(item => (
              <div key={item.id} className="card">
                {/* 상품 이미지 (회색 박스) */}
                <div className="card-image">
                  <span>{item.title.substring(0, 1)}</span> {/* 첫 글자만 로고처럼 표시 */}
                </div>

                {/* 정보 영역 */}
                <div>
              <span className={`tag ${item.itemType === 'LOST' ? 'lost' : 'found'}`}>
                {item.itemType === 'LOST' ? 'LOST' : 'FOUND'}
              </span>
                </div>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-info">{new Date(item.regDate).toLocaleDateString()}</p>
                <p className="card-info" style={{fontSize: '11px'}}>By {item.writer ? item.writer.name : 'Unknown'}</p>
              </div>
          ))}
        </div>
      </div>
  );
}

export default App;