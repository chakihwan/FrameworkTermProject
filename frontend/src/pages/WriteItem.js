import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WriteItem = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [itemType, setItemType] = useState('LOST');
    const [file, setFile] = useState(null); // ★ 파일 상태 추가

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            alert('로그인이 필요합니다!');
            navigate('/login');
            return;
        }

        // ★ FormData 객체 생성 (파일 전송용)
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('itemType', itemType);
        formData.append('username', user.username);
        if (file) {
            formData.append('file', file); // 파일이 있을 때만 추가
        }

        try {
            // 헤더 설정 불필요 (axios가 알아서 처리함)
            await axios.post('http://localhost:8081/api/items', formData);
            alert('등록 완료!');
            navigate('/');
        } catch (error) {
            console.error(error);
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

                {/* ★ 파일 업로드 인풋 */}
                <div style={{ border:'1px dashed #ccc', padding:'20px', textAlign:'center' }}>
                    <p style={{margin:'0 0 10px 0', fontSize:'12px', color:'#888'}}>IMAGE UPLOAD (Optional)</p>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*" />
                </div>

                <button type="submit" style={{ padding: '15px', background: 'black', color: 'white', border: 'none', cursor: 'pointer' }}>REGISTER</button>
            </form>
        </div>
    );
};

export default WriteItem;