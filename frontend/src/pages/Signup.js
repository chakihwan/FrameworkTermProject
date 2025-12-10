import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '', password: '', name: '', studentId: '', phoneNumber: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            // [Frontend -> Backend]
            // 보내는 곳: React
            // 받는 곳: MemberController의 @PostMapping("/signup")
            // 데이터 형태: SignupRequest DTO와 동일 (username, password, name, studentId, phoneNumber)
            await axios.post('http://localhost:8081/api/members/signup', formData);

            alert('가입 성공! 로그인 해주세요.');
            navigate('/login'); // 로그인 페이지로 이동

        } catch (error) {
            console.error(error);
            alert('가입 실패. 아이디나 학번이 이미 존재할 수 있습니다.');
        }
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h2 style={{ letterSpacing: '2px', textTransform: 'uppercase' }}>Join Us</h2>
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                {/* name 속성이 백엔드 DTO 필드명과 일치해야 함! */}
                <input name="username" placeholder="ID" onChange={handleChange} required style={{ padding: '10px', width: '250px' }} />
                <input name="password" type="password" placeholder="PASSWORD" onChange={handleChange} required style={{ padding: '10px', width: '250px' }} />
                <input name="name" placeholder="NAME" onChange={handleChange} required style={{ padding: '10px', width: '250px' }} />
                <input name="studentId" placeholder="STUDENT ID (학번)" onChange={handleChange} required style={{ padding: '10px', width: '250px' }} />
                <input name="phoneNumber" placeholder="PHONE NUMBER" onChange={handleChange} required style={{ padding: '10px', width: '250px' }} />

                <button type="submit" style={{ padding: '10px 40px', background: 'black', color: 'white', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
                    CREATE ACCOUNT
                </button>
            </form>
        </div>
    );
};

export default Signup;