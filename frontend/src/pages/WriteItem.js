import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WriteItem = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [itemType, setItemType] = useState('LOST');
    const [kakaoLink, setKakaoLink] = useState(''); // ★ 링크 상태 추가
    const [isPhoneOpen, setIsPhoneOpen] = useState(false); // 추가: 공개 동의 상태
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
        formData.append('phoneOpen', isPhoneOpen);    // ★ 백엔드로 전송
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
            <h2 style={{ textAlign: 'center', letterSpacing: '2px', marginBottom:'30px' }}>REGISTER ITEM</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* 분실/습득 선택 */}
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <label style={{cursor:'pointer'}}><input type="radio" value="LOST" checked={itemType==='LOST'} onChange={(e)=>setItemType(e.target.value)}/> <span style={{fontWeight:'bold', color:'red'}}>LOST</span></label>
                    <label style={{cursor:'pointer'}}><input type="radio" value="FOUND" checked={itemType==='FOUND'} onChange={(e)=>setItemType(e.target.value)}/> <span style={{fontWeight:'bold', color:'green'}}>FOUND</span></label>
                </div>

                <input placeholder="TITLE" value={title} onChange={(e)=>setTitle(e.target.value)} style={{ padding: '15px', border:'1px solid #ddd' }} />
                <textarea placeholder="DETAILS" value={content} onChange={(e)=>setContent(e.target.value)} rows="6" style={{ padding: '15px', border:'1px solid #ddd' }} />

                {/* ★ 카톡 링크 & 연락처 공개 설정 영역 */}
                <div style={{ background:'#f9f9f9', padding:'20px', borderRadius:'8px' }}>
                    <h4 style={{marginTop:0, marginBottom:'15px', color:'#555'}}>📞 연락 방법 설정</h4>

                    {/* 1. 카톡 링크 */}
                    <div style={{marginBottom:'15px'}}>
                        <label style={{fontSize:'12px', fontWeight:'bold', display:'block', marginBottom:'5px'}}>옵션 1: 카카오톡 오픈채팅 (추천)</label>
                        <input
                            placeholder="링크 입력 (https://open.kakao.com/...)"
                            value={kakaoLink}
                            onChange={(e)=>setKakaoLink(e.target.value)}
                            style={{ width:'100%', padding: '10px', boxSizing:'border-box', border:'1px solid #ddd' }}
                        />
                    </div>

                    {/* 2. 전화번호 공개 동의 체크박스 */}
                    <div>
                        <label style={{fontSize:'12px', fontWeight:'bold', display:'block', marginBottom:'5px'}}>옵션 2: 전화번호 공개</label>
                        <label style={{ fontSize: '14px', cursor: 'pointer', display:'flex', alignItems:'center' }}>
                            <input
                                type="checkbox"
                                checked={isPhoneOpen}
                                onChange={(e) => setIsPhoneOpen(e.target.checked)}
                                style={{ width:'18px', height:'18px', marginRight:'8px' }}
                            />
                            로그인한 회원에게 내 전화번호를 공개합니다.
                        </label>
                        <p style={{fontSize:'11px', color:'#888', marginTop:'5px'}}>
                            * 체크하지 않으면 연락처가 보이지 않으며, 댓글로만 소통할 수 있습니다.
                        </p>
                    </div>
                </div>

                {/* 파일 업로드 */}
                <div style={{ border:'2px dashed #eee', padding:'20px', textAlign:'center' }}>
                    <p style={{margin:'0', fontSize:'12px', color:'#888'}}>IMAGE UPLOAD</p>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*" style={{marginTop:'10px'}} />
                </div>

                <button type="submit" style={{ padding: '15px', background: 'black', color: 'white', border: 'none', cursor: 'pointer', fontWeight:'bold' }}>REGISTER</button>
            </form>
        </div>
    );
};

export default WriteItem;