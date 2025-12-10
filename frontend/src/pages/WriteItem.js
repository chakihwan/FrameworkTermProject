import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WriteItem = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [itemType, setItemType] = useState('LOST');
    const [kakaoLink, setKakaoLink] = useState(''); // ★ 링크 상태 추가
    const [file, setFile] = useState(null);

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
        formData.append('kakaoLink', kakaoLink);
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
            <h2 style={{ textAlign: 'center', letterSpacing: '2px', marginBottom:'30px' }}>분실물 등록하기</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* 분실/습득 선택 */}
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <label style={{cursor:'pointer'}}>
                        <input type="radio" value="LOST" checked={itemType==='LOST'} onChange={(e)=>setItemType(e.target.value)}/>
                        <span style={{marginLeft:'5px', fontWeight:'bold', color:'#d32f2f'}}>LOST (분실)</span>
                    </label>
                    <label style={{cursor:'pointer'}}>
                        <input type="radio" value="FOUND" checked={itemType==='FOUND'} onChange={(e)=>setItemType(e.target.value)}/>
                        <span style={{marginLeft:'5px', fontWeight:'bold', color:'#2ecc71'}}>FOUND (습득)</span>
                    </label>
                </div>

                <input
                    placeholder="TITLE (제목)"
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                    style={{ padding: '15px', border:'1px solid #ddd', borderRadius:'5px' }}
                />

                <textarea
                    placeholder="DETAILS (내용을 상세히 적어주세요)"
                    value={content}
                    onChange={(e)=>setContent(e.target.value)}
                    rows="6"
                    style={{ padding: '15px', border:'1px solid #ddd', borderRadius:'5px', resize:'none' }}
                />

                {/* ★ 카카오톡 링크 입력칸 (추가됨) */}
                <div style={{ background:'#f9f9f9', padding:'15px', borderRadius:'5px' }}>
                    <label style={{fontSize:'12px', fontWeight:'bold', color:'#555', display:'block', marginBottom:'5px'}}>
                        KAKAO OPEN CHAT (선택사항)
                    </label>
                    <input
                        placeholder="예: https://open.kakao.com/o/sXxXxXx"
                        value={kakaoLink}
                        onChange={(e)=>setKakaoLink(e.target.value)}
                        style={{ width:'100%', padding: '10px', border:'1px solid #ddd', borderRadius:'4px', boxSizing:'border-box' }}
                    />
                    <p style={{fontSize:'11px', color:'#888', marginTop:'5px'}}>
                        * 링크를 입력하면 상세 페이지에 '카톡 문의하기' 버튼이 생깁니다. (비워두면 연락처가 표시됩니다.)
                    </p>
                </div>

                {/* 파일 업로드 */}
                <div style={{ border:'2px dashed #eee', padding:'20px', textAlign:'center', borderRadius:'5px' }}>
                    <p style={{margin:'0 0 10px 0', fontSize:'12px', color:'#888'}}>IMAGE UPLOAD</p>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*" />
                </div>

                <button type="submit" style={{ padding: '15px', background: 'black', color: 'white', border: 'none', cursor: 'pointer', fontWeight:'bold', borderRadius:'5px' }}>
                    등록하기
                </button>
            </form>
        </div>
    );
};

export default WriteItem;