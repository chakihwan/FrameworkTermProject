import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8081/api/members/login', { username, password });

            // 로그인 성공 시 사용자 정보 저장
            localStorage.setItem('user', JSON.stringify(response.data));
            alert(`${response.data.name}님 환영합니다!`);

            // 메인 화면으로 이동 (새로고침 효과를 위해 window.location 사용 가능하지만, 리액트 방식 권장)
            navigate('/');
            window.location.reload(); // 네비게이션 바 상태 갱신을 위해 새로고침
        } catch (error) {
            alert('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
        }
    };

    // 스타일 정의 (Signup.js와 통일감 있게)
    const containerStyle = {
        maxWidth: '450px',
        margin: '80px auto',
        padding: '20px'
    };

    const cardStyle = {
        background: 'white',
        padding: '50px',
        borderRadius: '20px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
        textAlign: 'center',
        border: '1px solid #eee'
    };

    const inputGroupStyle = {
        marginBottom: '25px',
        textAlign: 'left'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        fontSize: '13px',
        fontWeight: 'bold',
        color: '#555',
        marginLeft: '5px'
    };

    const inputStyle = {
        width: '100%',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        fontSize: '16px',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s',
        backgroundColor: '#fafafa'
    };

    const buttonStyle = {
        width: '100%',
        padding: '18px',
        marginTop: '10px',
        background: 'linear-gradient(135deg, #ff9800 0%, #e65100 100%)', // 오렌지 그라데이션
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '800',
        cursor: 'pointer',
        boxShadow: '0 10px 20px rgba(230, 81, 0, 0.25)',
        transition: 'transform 0.2s',
        letterSpacing: '1px'
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>

                {/* 헤더 */}
                <h2 style={{ fontSize: '32px', color: '#e65100', margin: '0 0 10px 0', fontWeight: '900', letterSpacing:'-1px' }}>LOGIN</h2>
                <p style={{ color: '#999', fontSize: '14px', marginBottom: '50px' }}>서비스 이용을 위해 로그인해주세요.</p>

                <form onSubmit={handleSubmit}>

                    {/* 아이디 입력 */}
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>아이디 (ID)</label>
                        <input
                            type="text"
                            placeholder="아이디를 입력하세요"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={inputStyle}
                            onFocus={(e)=>e.target.style.borderColor='#e65100'}
                            onBlur={(e)=>e.target.style.borderColor='#ddd'}
                            required
                        />
                    </div>

                    {/* 비밀번호 입력 */}
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>비밀번호 (Password)</label>
                        <input
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            onFocus={(e)=>e.target.style.borderColor='#e65100'}
                            onBlur={(e)=>e.target.style.borderColor='#ddd'}
                            required
                        />
                    </div>

                    {/* 로그인 버튼 */}
                    <button
                        type="submit"
                        style={buttonStyle}
                        onMouseDown={(e)=>e.currentTarget.style.transform='scale(0.98)'}
                        onMouseUp={(e)=>e.currentTarget.style.transform='scale(1)'}
                    >
                        로그인하기
                    </button>
                </form>

                {/* 링크 영역 */}
                <div style={{ marginTop: '40px', fontSize: '14px', color: '#888', borderTop:'1px solid #f1f1f1', paddingTop:'30px', display:'flex', justifyContent:'center', gap:'20px' }}>
                    <Link to="/signup" style={{ color: '#555', textDecoration:'none' }}>회원가입</Link>
                    <span style={{color:'#ddd'}}>|</span>
                    <Link to="/find-account" style={{ color: '#e65100', fontWeight: 'bold', textDecoration:'none' }}>아이디/비밀번호 찾기</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;