import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WriteItem = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [itemType, setItemType] = useState('LOST'); // 기본값 분실
    const [kakaoLink, setKakaoLink] = useState('');
    const [isPhoneOpen, setIsPhoneOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // ★ 로딩 상태 추가

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return; // ★ 중복 클릭 방지

        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            alert('로그인이 필요합니다!');
            navigate('/login');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('itemType', itemType);
        formData.append('username', user.username);
        formData.append('kakaoLink', kakaoLink);
        formData.append('phoneOpen', isPhoneOpen); // ★ 핵심: 'is' 빼고 보냄
        if (file) {
            formData.append('file', file);
        }

        setIsSubmitting(true); // ★ 로딩 시작

        try {
            await axios.post('http://localhost:8081/api/items', formData);
            alert('등록이 완료되었습니다!');
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('등록 실패');
            setIsSubmitting(false); // ★ 실패하면 다시 누를 수 있게 풀어줌
        }
    };

    // 공통 입력창 스타일
    const inputStyle = { width: '100%', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', transition: 'border-color 0.3s' };

    return (
        <div style={{ padding: '60px 20px', maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ backgroundColor: '#fff', padding: '50px', borderRadius: '20px', boxShadow: '0 15px 40px rgba(0,0,0,0.08)' }}>

                <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: '800', marginBottom: '40px', color: '#333' }}>
                    물건 등록하기
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                    {/* 1. 분실/습득 선택 (세련된 토글 버튼) */}
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <label style={{ flex: 1, cursor: 'pointer' }}>
                            <input type="radio" value="LOST" checked={itemType==='LOST'} onChange={(e)=>setItemType(e.target.value)} style={{display:'none'}}/>
                            <div style={{ padding: '15px', textAlign: 'center', borderRadius: '10px', border: itemType==='LOST'?'2px solid #e74c3c':'1px solid #ddd', backgroundColor: itemType==='LOST'?'#fff5f5':'#f9f9f9', color: itemType==='LOST'?'#e74c3c':'#888', fontWeight: 'bold', transition: 'all 0.3s' }}>
                                😥 잃어버렸어요 (LOST)
                            </div>
                        </label>
                        <label style={{ flex: 1, cursor: 'pointer' }}>
                            <input type="radio" value="FOUND" checked={itemType==='FOUND'} onChange={(e)=>setItemType(e.target.value)} style={{display:'none'}}/>
                            <div style={{ padding: '15px', textAlign: 'center', borderRadius: '10px', border: itemType==='FOUND'?'2px solid #2ecc71':'1px solid #ddd', backgroundColor: itemType==='FOUND'?'#e8f8f5':'#f9f9f9', color: itemType==='FOUND'?'#2ecc71':'#888', fontWeight: 'bold', transition: 'all 0.3s' }}>
                                🔍 주웠어요 (FOUND)
                            </div>
                        </label>
                    </div>

                    {/* 2. 기본 정보 입력 */}
                    <div>
                        <label style={{fontWeight:'bold', display:'block', marginBottom:'8px', color:'#555'}}>제목</label>
                        <input placeholder="예: 에어팟 프로 오른쪽 유닛" value={title} onChange={(e)=>setTitle(e.target.value)} style={inputStyle} required />
                    </div>

                    <div>
                        <label style={{fontWeight:'bold', display:'block', marginBottom:'8px', color:'#555'}}>상세 내용</label>
                        <textarea placeholder="습득 장소, 특징, 보관 장소 등을 상세히 적어주세요." value={content} onChange={(e)=>setContent(e.target.value)} rows="6" style={{...inputStyle, resize:'none'}} required />
                    </div>

                    {/* 3. 연락 방법 설정 (깔끔한 박스 디자인) */}
                    <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '12px', border: '1px solid #eee' }}>
                        <h4 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '16px' }}>📞 연락 방법 설정</h4>

                        {/* 카톡 링크 */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#555' }}>옵션 1: 카카오톡 오픈채팅 (추천)</label>
                            <input
                                placeholder="링크 입력 (https://open.kakao.com/...)"
                                value={kakaoLink}
                                onChange={(e)=>setKakaoLink(e.target.value)}
                                style={{ ...inputStyle, backgroundColor:'#fff' }}
                            />
                            <p style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>* 링크를 입력하면 상세 페이지에 '카톡 문의 버튼'이 생성됩니다.</p>
                        </div>

                        {/* 전화번호 공개 동의 */}
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#555' }}>옵션 2: 전화번호 공개</label>
                            <label style={{ fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', background:'#fff', padding:'10px', borderRadius:'8px', border:'1px solid #ddd' }}>
                                <input
                                    type="checkbox"
                                    checked={isPhoneOpen}
                                    onChange={(e) => setIsPhoneOpen(e.target.checked)}
                                    style={{ width: '18px', height: '18px', marginRight: '10px', accentColor:'#333' }}
                                />
                                로그인한 회원에게 내 전화번호를 공개합니다.
                            </label>
                            <p style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>* 동의하지 않으면 댓글로만 소통할 수 있습니다.</p>
                        </div>
                    </div>

                    {/* 4. 파일 업로드 (드래그앤드롭 스타일) */}
                    <div style={{ border: '2px dashed #ccc', padding: '30px', textAlign: 'center', borderRadius: '12px', backgroundColor: '#fafafa', transition: 'all 0.3s', cursor:'pointer' }} onDragOver={(e)=>{e.currentTarget.style.borderColor='#999';e.currentTarget.style.backgroundColor='#f0f0f0'}} onDragLeave={(e)=>{e.currentTarget.style.borderColor='#ccc';e.currentTarget.style.backgroundColor='#fafafa'}}>
                        <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#777', fontWeight:'bold' }}>📷 사진 업로드 (선택)</p>
                        <p style={{ fontSize:'12px', color:'#aaa', marginBottom:'15px' }}>클릭하거나 파일을 여기로 드래그하세요.</p>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*" style={{ display:'none' }} id="fileUpload" />
                        <label htmlFor="fileUpload" style={{ padding:'8px 20px', background:'#fff', border:'1px solid #ccc', borderRadius:'5px', fontSize:'13px', cursor:'pointer', fontWeight:'bold', color:'#555' }}>파일 선택</label>
                        {file && <p style={{marginTop:'15px', fontSize:'13px', color:'#2ecc71', fontWeight:'bold'}}>✅ {file.name}</p>}
                    </div>

                    {/* 등록 버튼 (스타일 교체됨) */}
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isSubmitting} // 로딩 상태
                    >
                        {/* 로딩 상태가 있다면 텍스트 변경, 없다면 그냥 '등록 완료' */}
                        {typeof isSubmitting !== 'undefined' && isSubmitting ? '업로드 중...' : '등록하기'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WriteItem;