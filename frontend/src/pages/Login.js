import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // [Frontend -> Backend]
            // 보내는 곳: React (여기)
            // 받는 곳: SpringBoot MemberController의 @PostMapping("/login")
            // 데이터 형태: { "username": "...", "password": "..." } (JSON)
            const response = await axios.post('http://localhost:8081/api/members/login', {
                username: username,
                password: password
            });

            // [Backend -> Frontend]
            // 받는 데이터: 로그인 성공한 회원의 전체 정보 (id, name, studentId 등)
            console.log("서버 응답 데이터:", response.data);

            // 브라우저 저장소(LocalStorage)에 회원 정보 저장 (새로고침 해도 로그인 유지용)
            localStorage.setItem('user', JSON.stringify(response.data));

            alert('로그인 성공!');

            // [수정 후]
            window.location.replace('/'); // 페이지를 새로고침하며 메인으로 이동 (App.js가 다시 실행됨)

        } catch (error) {
            console.error("로그인 에러:", error);
            alert('로그인 실패! 아이디나 비밀번호를 확인하세요.');
        }
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h2 style={{ letterSpacing: '2px', textTransform: 'uppercase' }}>Login</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <input
                    placeholder="USERNAME"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ padding: '10px', width: '250px', border: '1px solid #ccc' }}
                />
                <input
                    type="password"
                    placeholder="PASSWORD"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: '10px', width: '250px', border: '1px solid #ccc' }}
                />
                <button type="submit" style={{ padding: '10px 40px', background: 'black', color: 'white', border: 'none', cursor: 'pointer' }}>
                    LOGIN
                </button>
            </form>
        </div>
    );
};

export default Login;