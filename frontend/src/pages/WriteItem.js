import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WriteItem = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [itemType, setItemType] = useState('LOST');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 로컬스토리지에 저장된 로그인 정보 꺼내기
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            alert('로그인이 필요합니다!');
            navigate('/login');
            return;
        }

        try {
            // [Frontend -> Backend]
            // 보내는 곳: React
            // 받는 곳: LostItemController의 @PostMapping
            // 데이터: { title, content, itemType, username(작성자 식별용) }
            await axios.post('http://localhost:8081/api/items', {
                title: title,
                content: content,
                itemType: itemType,
                username: user.username // ★ 중요: 누가 썼는지 백엔드에 알려줌
            });

            alert('등록 완료!');
            navigate('/'); // 메인으로 이동
        } catch (error) {
            alert('등록 실패');
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', letterSpacing: '2px' }}>REGISTER ITEM</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <label><input type="radio" value="LOST" checked={itemType==='LOST'} onChange={(e)=>setItemType(e.target.value)}/> LOST (분실)</label>
                    <label><input type="radio" value="FOUND" checked={itemType==='FOUND'} onChange={(e)=>setItemType(e.target.value)}/> FOUND (습득)</label>
                </div>

                <input placeholder="TITLE" value={title} onChange={(e)=>setTitle(e.target.value)} style={{ padding: '10px' }} />
                <textarea placeholder="DETAILS..." value={content} onChange={(e)=>setContent(e.target.value)} rows="6" style={{ padding: '10px' }} />

                <button type="submit" style={{ padding: '15px', background: 'black', color: 'white', border: 'none', cursor: 'pointer' }}>등록하기</button>
            </form>
        </div>
    );
};

export default WriteItem;