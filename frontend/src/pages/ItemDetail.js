import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ItemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [isSecret, setIsSecret] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const itemRes = await axios.get(`http://192.168.24.186:8081/api/items/${id}`);
            setItem(itemRes.data);
            const commentRes = await axios.get(`http://192.168.24.186:8081/api/comments/${id}`);
            setComments(commentRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    // 상태 변경 기능 (기존 로직 유지)
    const toggleStatus = async () => {
        const newStatus = item.status === 'ING' ? 'DONE' : 'ING';
        const confirmMsg = newStatus === 'DONE'
            ? "물건을 찾으셨나요? '해결됨' 상태로 변경합니다."
            : "다시 '찾는 중' 상태로 변경하시겠습니까?";

        if (window.confirm(confirmMsg)) {
            try {
                await axios.put(`http://192.168.24.186:8081/api/items/${id}/status`, { status: newStatus });
                setItem({ ...item, status: newStatus });
            } catch (err) { alert('상태 변경 실패'); }
        }
    };

    // 삭제 기능 (기존 로직 유지)
    const handleDelete = async () => {
        if (window.confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            await axios.delete(`http://192.168.24.186:8081/api/items/${id}`);
            alert('삭제되었습니다.');
            navigate('/');
        }
    };

    // 댓글 등록 기능 (기존 로직 유지)
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) { alert('로그인이 필요합니다.'); navigate('/login'); return; }
        if (!commentContent.trim()) return;

        try {
            await axios.post('http://192.168.24.186:8081/api/comments', {
                itemId: id, content: commentContent, username: currentUser.username, secret: isSecret
            });
            setCommentContent(''); setIsSecret(false); fetchData();
        } catch (err) { alert('댓글 등록 실패'); }
    };

    if (!item) return <div style={{textAlign:'center', padding:'100px', color:'#999', fontSize:'18px'}}>Loading...</div>;

    const isWriter = currentUser && currentUser.username === item.writer?.username;
    // ★ [추가] 관리자 확인 (Role이 'ADMIN'인 경우)
    const isAdmin = currentUser && currentUser.role === 'ADMIN';
    const isPhonePublic = item.phoneOpen || item.isPhoneOpen; // 로직 유지

    return (
        <div style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer', color:'#888', fontSize:'15px', fontWeight:'bold', display:'flex', alignItems:'center' }}>← 목록으로 돌아가기</button>

            {/* 상세 카드 영역 (더 깊은 그림자) */}
            <div style={{ backgroundColor:'#fff', borderRadius:'25px', boxShadow:'0 20px 60px rgba(0,0,0,0.08)', overflow:'hidden', position:'relative' }}>

                {/* SOLVED 도장 */}
                {item.status === 'DONE' && (
                    <div style={{ position: 'absolute', top: '30px', right: '30px', border: '4px solid #ccc', color: '#ccc', fontSize: '28px', fontWeight: '900', padding: '10px 25px', transform: 'rotate(-15deg)', zIndex: 10, pointerEvents: 'none', opacity: 0.7 }}>SOLVED</div>
                )}

                <div style={{ padding: '50px' }}>
                    {/* 1. 헤더 영역 */}
                    <div style={{ marginBottom: '35px' }}>

                        {/* 태그들을 감싸는 박스 (수직 중앙 정렬 확실하게!) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>

                            {/* 1. LOST/FOUND 태그 (디자인 통일) */}
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', // 텍스트 정중앙 배치
                                height: '32px', padding: '0 14px', borderRadius: '20px', // 높이와 둥글기 고정
                                fontSize: '13px', fontWeight: '800',
                                backgroundColor: item.itemType === 'LOST' ? '#ffebee' : '#e8f5e9', // 연한 빨강 vs 연한 초록
                                color: item.itemType === 'LOST' ? '#d32f2f' : '#2e7d32',       // 진한 빨강 vs 진한 초록
                                border: item.itemType === 'LOST' ? '1px solid #ffcdd2' : '1px solid #c8e6c9',
                                boxSizing: 'border-box' // 테두리 포함 크기 계산
                            }}>
                {item.itemType}
              </span>

                            {/* 2. 상태(찾는중/해결됨) 태그 (위랑 똑같은 스펙으로 맞춤) */}
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                height: '32px', padding: '0 14px', borderRadius: '20px',
                                fontSize: '13px', fontWeight: '800',
                                backgroundColor: item.status === 'DONE' ? '#f5f5f5' : '#e3f2fd', // 회색 vs 연한 파랑
                                color: item.status === 'DONE' ? '#9e9e9e' : '#1976d2',       // 회색 vs 진한 파랑
                                border: item.status === 'DONE' ? '1px solid #e0e0e0' : '1px solid #bbdefb',
                                boxSizing: 'border-box'
                            }}>
                {item.status === 'DONE' ? '해결 완료' : '찾는 중'}
              </span>
                        </div>

                        {/* 제목 */}
                        <h1 style={{ fontSize: '36px', margin: '0 0 20px 0', color: item.status==='DONE'?'#aaa':'#222', textDecoration: item.status==='DONE'?'line-through':'none', fontWeight:'800', lineHeight:'1.3' }}>
                            {item.title}
                        </h1>

                        {/* 작성자 정보 */}
                        <div style={{ color: '#999', fontSize: '14px', display:'flex', alignItems:'center', gap:'10px' }}>
                            <span style={{fontWeight:'bold', color:'#555'}}>{item.writer?.name}</span>
                            <span style={{fontSize:'12px'}}>•</span>
                            <span>{new Date(item.regDate).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* 2. 이미지 영역 (시원하게 키움) */}
                    <div style={{ width: '100%', marginBottom: '50px', textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius:'15px', overflow:'hidden', border:'1px solid #eee' }}>
                        {item.imagePath ? (
                            <img src={`http://192.168.24.186:8081/images/${item.imagePath}`} alt="item" style={{ width:'100%', maxHeight:'700px', objectFit:'contain', filter: item.status==='DONE' ? 'grayscale(100%) opacity(0.8)' : 'none', transition: 'all 0.3s', display: 'block' }} />
                        ) : (
                            <div style={{color:'#ccc', padding:'80px 0', fontSize:'16px', fontWeight:'bold'}}>이미지가 없습니다.</div>
                        )}
                    </div>

                    {/* 3. 본문 내용 */}
                    <div style={{ minHeight: '150px', whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '17px', color: item.status==='DONE'?'#888':'#444', marginBottom: '50px' }}>{item.content}</div>

                    {/* 4. 작성자 또는 관리자 메뉴 */}
                    {(isWriter || isAdmin) && (
                        <div style={{ marginTop: '50px', padding: '25px', backgroundColor: '#f8f9fa', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border:'1px solid #eee' }}>
                          <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#555' }}>
                              {isAdmin ? '👮‍♂️ 관리자 메뉴' : '⚙️ 작성자 관리 메뉴'}
                          </span>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {/* 상태 변경은 작성자만 가능하게 할지, 관리자도 할지 선택 (여기선 작성자만) */}
                                {isWriter && (
                                    <button onClick={toggleStatus} style={{ padding: '12px 24px', cursor: 'pointer', border: '1px solid #555', backgroundColor: item.status === 'ING' ? '#555' : '#fff', color: item.status === 'ING' ? '#fff' : '#555', borderRadius: '8px', fontWeight: 'bold', transition: 'all 0.3s', fontSize:'14px' }}>
                                        {item.status === 'ING' ? '✅ 해결 완료 처리' : '🔄 다시 찾는 중으로'}
                                    </button>
                                )}

                                {/* 삭제는 관리자도 가능! */}
                                <button onClick={handleDelete} style={{ padding: '12px 24px', cursor: 'pointer', background: '#fff0f0', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '8px', fontWeight: 'bold', fontSize:'14px' }}>
                                    🗑 삭제하기
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 5. 연락처/카톡 표시 영역 (입체적인 버튼 디자인) */}
                    {!isWriter && item.status !== 'DONE' && (
                        <div style={{ textAlign: 'center', marginTop: '50px', borderTop:'2px solid #f1f1f1', paddingTop:'40px' }}>
                            {item.kakaoLink && item.kakaoLink.trim() !== "" ? (
                                <a href={item.kakaoLink} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems:'center', gap:'10px', padding: '18px 45px', background: 'linear-gradient(to bottom, #fee500, #fdd835)', color: '#3b1e1e', textDecoration: 'none', fontWeight: 'bold', borderRadius: '50px', fontSize:'17px', boxShadow: '0 5px 15px rgba(254, 229, 0, 0.4)', border:'1px solid #fbc02d', transition:'transform 0.2s' }} onMouseDown={(e)=>e.currentTarget.style.transform='scale(0.98)'} onMouseUp={(e)=>e.currentTarget.style.transform='scale(1)'}>
                                    <span style={{fontSize:'24px'}}>💬</span> 카카오톡으로 바로 연락하기
                                </a>
                            ) : (
                                isPhonePublic ? (
                                    <div style={{ padding:'25px 50px', background:'#f0f8ff', borderRadius:'15px', display:'inline-block', border:'2px solid #cce5ff', boxShadow:'0 5px 15px rgba(0, 123, 255, 0.1)' }}>
                                        <div style={{fontSize:'13px', color:'#007bff', marginBottom:'8px', fontWeight:'bold', letterSpacing:'1px'}}>CONTACT INFO</div>
                                        <div style={{fontSize:'22px', fontWeight:'900', color:'#0056b3'}}>{currentUser ? item.writer?.phoneNumber : '🔒 로그인 후 확인 가능'}</div>
                                    </div>
                                ) : (
                                    <div style={{ padding:'25px', background:'#f9f9f9', borderRadius:'15px', color:'#777', display:'inline-block', fontSize:'15px', border:'1px solid #eee' }}>
                                        <span style={{display:'block', marginBottom:'10px', fontSize:'28px'}}>🔕</span>
                                        작성자가 연락처를 비공개했습니다.<br/>아래 <b>비밀 댓글</b>로 소통해주세요.
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* 댓글 영역 (깔끔한 정리) */}
            <div style={{ marginTop: '70px' }}>
                <h3 style={{fontSize:'22px', fontWeight:'800', color:'#333', marginBottom:'25px'}}>댓글 ({comments.length})</h3>
                <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '15px', marginBottom: '40px', background:'#fff', padding:'25px', border:'1px solid #eee', borderRadius:'15px', boxShadow:'0 5px 20px rgba(0,0,0,0.05)' }}>
                    <textarea placeholder={currentUser ? "댓글을 입력하세요..." : "로그인 후 이용 가능합니다."} value={commentContent} onChange={(e) => setCommentContent(e.target.value)} disabled={!currentUser} style={{ flex: 1, padding: '15px', height: '60px', borderRadius:'10px', border:'2px solid #eee', resize:'none', fontFamily:'inherit', fontSize:'15px', transition:'border-color 0.3s' }} onFocus={(e)=>e.target.style.borderColor='#333'} onBlur={(e)=>e.target.style.borderColor='#eee'}/>
                    <div style={{ textAlign: 'center', width:'90px', display:'flex', flexDirection:'column', gap:'10px' }}>
                        <label style={{ fontSize: '13px', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px', color:'#555', fontWeight:'bold', userSelect:'none' }}>
                            <input type="checkbox" checked={isSecret} onChange={(e) => setIsSecret(e.target.checked)} style={{width:'16px', height:'16px', accentColor:'#333'}}/> 비밀글
                        </label>
                        <button type="submit" disabled={!currentUser} style={{ width:'100%', padding: '12px 0', background: '#333', color: 'white', border: 'none', borderRadius:'10px', cursor: 'pointer', opacity: currentUser ? 1 : 0.6, fontWeight:'bold', fontSize:'15px', transition:'background 0.3s' }}>등록</button>
                    </div>
                </form>
                <div style={{ display:'flex', flexDirection:'column', gap:'15px' }}>
                    {comments.map((comment) => {
                        const isSecretComment = comment.secret || comment.isSecret;
                        const canSee = currentUser && (currentUser.username === comment.writer?.username || currentUser.username === item.writer?.username);
                        return (
                            <div key={comment.id} style={{ padding: '20px', background: isSecretComment && !canSee ? '#f9f9f9' : '#fff', border:'1px solid #eee', borderRadius: '12px' }}>
                                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px', alignItems:'center' }}>
                  <span style={{ fontWeight: 'bold', fontSize:'15px', color:'#333', display:'flex', alignItems:'center', gap:'8px' }}>
                    {comment.writer?.name}
                      {isSecretComment && <span style={{fontSize:'12px', padding:'2px 6px', background:'#eee', borderRadius:'4px', color:'#777'}}>비밀글 🔒</span>}
                  </span>
                                    <span style={{ fontSize: '13px', color: '#aaa' }}>{new Date(comment.regDate).toLocaleString()}</span>
                                </div>
                                <div style={{ fontSize: '15px', color: '#555', lineHeight:'1.6' }}>
                                    {isSecretComment && !canSee ? <span style={{ color: '#bbb', fontStyle:'italic' }}>비밀 댓글입니다. (작성자와 관리자만 볼 수 있습니다.)</span> : comment.content}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ItemDetail;