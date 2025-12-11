import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const FindAccount = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState('ID'); // 'ID' or 'PW'

    // 입력값 상태
    const [formData, setFormData] = useState({
        username: '', name: '', phoneNumber: '', newPassword: ''
    });

    // 결과 메시지 상태
    const [resultMsg, setResultMsg] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 아이디 찾기
    const handleFindId = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8081/api/members/find-id', {
                name: formData.name,
                phoneNumber: formData.phoneNumber
            });
            setResultMsg(`회원님의 아이디는 [ ${res.data} ] 입니다.`);
        } catch (err) {
            alert('일치하는 회원 정보가 없습니다.');
        }
    };

    // 비밀번호 재설정
    const handleResetPw = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8081/api/members/reset-password', formData);
            alert('비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.');
            navigate('/login');
        } catch (err) {
            alert('입력하신 정보가 회원 정보와 일치하지 않습니다.');
        }
    };

    // 스타일 (기존 테마 유지)
    const containerStyle = { maxWidth: '450px', margin: '80px auto', padding: '20px' };
    const cardStyle = { background: 'white', padding: '50px', borderRadius: '20px', boxShadow: '0 15px 40px rgba(0,0,0,0.08)', textAlign: 'center', border: '1px solid #eee' };
    const inputStyle = { width: '100%', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '15px', boxSizing: 'border-box', marginBottom: '15px', background:'#fafafa' };
    const buttonStyle = { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #ff9800 0%, #e65100 100%)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 20px rgba(230, 81, 0, 0.25)' };
    const tabBtnStyle = (isActive) => ({
        flex: 1, padding: '15px', border: 'none', background: isActive ? '#fff' : '#f5f5f5',
        borderBottom: isActive ? '3px solid #e65100' : '1px solid #ddd',
        fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#e65100' : '#888', cursor: 'pointer', fontSize:'15px'
    });

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={{ fontSize: '28px', color: '#e65100', margin: '0 0 30px 0', fontWeight: '900' }}>ACCOUNT FINDER</h2>

                {/* 탭 메뉴 */}
                <div style={{ display: 'flex', marginBottom: '30px' }}>
                    <button onClick={() => {setTab('ID'); setResultMsg('');}} style={tabBtnStyle(tab === 'ID')}>아이디 찾기</button>
                    <button onClick={() => {setTab('PW'); setResultMsg('');}} style={tabBtnStyle(tab === 'PW')}>비밀번호 변경</button>
                </div>

                {/* 1. 아이디 찾기 폼 */}
                {tab === 'ID' && (
                    <form onSubmit={handleFindId}>
                        <p style={{fontSize:'13px', color:'#888', marginBottom:'20px'}}>가입 시 등록한 이름과 전화번호를 입력하세요.</p>
                        <input name="name" placeholder="이름 (Name)" onChange={handleChange} style={inputStyle} required />
                        <input name="phoneNumber" placeholder="전화번호 (010-0000-0000)" onChange={handleChange} style={inputStyle} required />
                        <button type="submit" style={buttonStyle}>아이디 찾기</button>
                        {resultMsg && <div style={{marginTop:'20px', padding:'15px', background:'#fff3e0', color:'#e65100', borderRadius:'10px', fontWeight:'bold'}}>{resultMsg}</div>}
                    </form>
                )}

                {/* 2. 비밀번호 재설정 폼 */}
                {tab === 'PW' && (
                    <form onSubmit={handleResetPw}>
                        <p style={{fontSize:'13px', color:'#888', marginBottom:'20px'}}>본인 확인을 위해 정보를 입력해주세요.</p>
                        <input name="username" placeholder="아이디 (ID)" onChange={handleChange} style={inputStyle} required />
                        <input name="name" placeholder="이름 (Name)" onChange={handleChange} style={inputStyle} required />
                        <input name="phoneNumber" placeholder="전화번호 (Phone)" onChange={handleChange} style={inputStyle} required />
                        <div style={{margin:'20px 0', borderTop:'1px dashed #ddd'}}></div>
                        <input type="password" name="newPassword" placeholder="새로운 비밀번호 입력" onChange={handleChange} style={{...inputStyle, borderColor:'#e65100', background:'#fff'}} required />
                        <button type="submit" style={buttonStyle}>비밀번호 변경하기</button>
                    </form>
                )}

                <div style={{ marginTop: '30px', fontSize: '13px' }}>
                    <Link to="/login" style={{ color: '#888', textDecoration: 'none' }}>← 로그인 화면으로 돌아가기</Link>
                </div>
            </div>
        </div>
    );
};

export default FindAccount;