import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    // ★ 기존 필드 유지 (학번 포함)
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        phoneNumber: '',
        studentId: '' // 학번 (기존 유지)
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://192.168.24.186:8081/api/members/signup', formData);
            alert('회원가입이 완료되었습니다! 로그인해주세요.');
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert('회원가입 실패 (아이디 중복 등)');
        }
    };

    // 디자인 스타일 (WriteItem.js 등과 통일감 있게)
    const containerStyle = {
        maxWidth: '450px',
        margin: '60px auto',
        padding: '20px'
    };

    const cardStyle = {
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
        textAlign: 'center',
        border: '1px solid #eee'
    };

    const inputGroupStyle = {
        marginBottom: '20px',
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
        padding: '14px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        fontSize: '15px',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s',
        backgroundColor: '#fafafa'
    };

    const buttonStyle = {
        width: '100%',
        padding: '16px',
        marginTop: '20px',
        background: 'linear-gradient(135deg, #ff9800 0%, #e65100 100%)', // 오렌지 그라데이션
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '800',
        cursor: 'pointer',
        boxShadow: '0 10px 20px rgba(230, 81, 0, 0.25)',
        transition: 'transform 0.2s'
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                {/* 헤더 */}
                <h2 style={{ fontSize: '32px', color: '#e65100', margin: '0 0 10px 0', fontWeight: '900', letterSpacing:'-1px' }}>JOIN US</h2>
                <p style={{ color: '#999', fontSize: '14px', marginBottom: '40px' }}>캠퍼스 로스트 앤 파운드 멤버가 되어보세요.</p>

                <form onSubmit={handleSubmit}>

                    {/* 아이디 */}
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>아이디 (ID)</label>
                        <input
                            name="username"
                            placeholder="사용할 아이디를 입력하세요"
                            onChange={handleChange}
                            style={inputStyle}
                            onFocus={(e)=>e.target.style.borderColor='#e65100'}
                            onBlur={(e)=>e.target.style.borderColor='#ddd'}
                            required
                        />
                    </div>

                    {/* 비밀번호 */}
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>비밀번호 (Password)</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="비밀번호를 입력하세요"
                            onChange={handleChange}
                            style={inputStyle}
                            onFocus={(e)=>e.target.style.borderColor='#e65100'}
                            onBlur={(e)=>e.target.style.borderColor='#ddd'}
                            required
                        />
                    </div>

                    {/* 이름 */}
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>이름 (Name)</label>
                        <input
                            name="name"
                            placeholder="본명을 입력하세요"
                            onChange={handleChange}
                            style={inputStyle}
                            onFocus={(e)=>e.target.style.borderColor='#e65100'}
                            onBlur={(e)=>e.target.style.borderColor='#ddd'}
                            required
                        />
                    </div>

                    {/* ★ 학번 (기존 유지) */}
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>학번 (Student ID)</label>
                        <input
                            name="studentId"
                            placeholder="예: 1234567890"
                            onChange={handleChange}
                            style={inputStyle}
                            onFocus={(e)=>e.target.style.borderColor='#e65100'}
                            onBlur={(e)=>e.target.style.borderColor='#ddd'}
                            required
                        />
                    </div>

                    {/* 전화번호 */}
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>전화번호 (Phone)</label>
                        <input
                            name="phoneNumber"
                            placeholder="010-0000-0000"
                            onChange={handleChange}
                            style={inputStyle}
                            onFocus={(e)=>e.target.style.borderColor='#e65100'}
                            onBlur={(e)=>e.target.style.borderColor='#ddd'}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={buttonStyle}
                        onMouseDown={(e)=>e.currentTarget.style.transform='scale(0.98)'}
                        onMouseUp={(e)=>e.currentTarget.style.transform='scale(1)'}
                    >
                        회원가입
                    </button>
                </form>

                <div style={{ marginTop: '30px', fontSize: '13px', color: '#888' }}>
                    이미 계정이 있으신가요? <Link to="/login" style={{ color: '#e65100', fontWeight: 'bold', textDecoration:'none' }}>로그인하기</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;