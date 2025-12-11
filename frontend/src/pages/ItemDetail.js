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
            const itemRes = await axios.get(`http://localhost:8081/api/items/${id}`);
            setItem(itemRes.data);
            const commentRes = await axios.get(`http://localhost:8081/api/comments/${id}`);
            setComments(commentRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    // 상태 변경 기능 (디자인된 버튼과 연결)
    const toggleStatus = async () => {
        const newStatus = item.status === 'ING' ? 'DONE' : 'ING';
        const confirmMsg = newStatus === 'DONE'
            ? "물건을 찾으셨나요? '해결됨' 상태로 변경합니다."
            : "다시 '찾는 중' 상태로 변경하시겠습니까?";

        if (window.confirm(confirmMsg)) {
            try {
                await axios.put(`http://localhost:8081/api/items/${id}/status`, { status: newStatus });
                setItem({ ...item, status: newStatus });
            } catch (err) {
                alert('상태 변경 실패');
            }
        }
    };

    const handleDelete = async () => {
        if (window.confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            await axios.delete(`http://localhost:8081/api/items/${id}`);
            alert('삭제되었습니다.');
            navigate('/');
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }
        if (!commentContent.trim()) return;

        try {
            await axios.post('http://localhost:8081/api/comments', {
                itemId: id,
                content: commentContent,
                username: currentUser.username,
                secret: isSecret
            });
            alert('댓글이 등록되었습니다.');
            setCommentContent('');
            setIsSecret(false);
            fetchData();
        } catch (err) {
            alert('댓글 등록 실패');
        }
    };

    if (!item) return <div style={{textAlign:'center', padding:'50px'}}>Loading...</div>;

    const isWriter = currentUser && currentUser.username === item.writer?.username;

    // ★ [로직 유지] 전화번호 공개 여부 판단 (백엔드 변수명 차이 해결)
    const isPhonePublic = item.phoneOpen || item.isPhoneOpen;

    return (
        <div style={{ padding: '50px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer', color:'#888', fontSize:'14px' }}>← BACK TO LIST</button>

            {/* 상세 카드 영역 (그림자 + 둥근 모서리) */}
            <div style={{ border: '1px solid #eee', padding: '40px', borderRadius:'15px', boxShadow:'0 10px 30px rgba(0,0,0,0.05)', position:'relative', overflow:'hidden', backgroundColor:'#fff' }}>

                {/* ★ SOLVED 도장 (우측 상단 고정) */}
                {item.status === 'DONE' && (
                    <div style={{
                        position: 'absolute', top: '25px', right: '25px',
                        border: '3px solid #ccc', color: '#ccc',
                        fontSize: '24px', fontWeight: 'bold', padding: '5px 20px',
                        transform: 'rotate(-15deg)', zIndex: 10, pointerEvents: 'none',
                        opacity: 0.8
                    }}>
                        SOLVED
                    </div>
                )}

                {/* 1. 헤더 영역 (태그 + 제목 + 작성자) */}
                <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <span className={`tag ${item.itemType==='LOST'?'lost':'found'}`} style={{ fontSize: '12px', padding: '4px 8px' }}>
              {item.itemType}
            </span>

                        {/* 상태 배지 */}
                        <span style={{
                            padding: '4px 8px', fontSize: '12px', borderRadius: '4px',
                            backgroundColor: item.status === 'DONE' ? '#555' : '#2ecc71',
                            color: 'white', fontWeight: 'bold'
                        }}>
              {item.status === 'DONE' ? '해결 완료' : '찾는 중'}
            </span>
                    </div>

                    <h1 style={{
                        fontSize: '32px', margin: '0 0 15px 0',
                        color: item.status==='DONE'?'#aaa':'#111',
                        textDecoration: item.status==='DONE'?'line-through':'none'
                    }}>
                        {item.title}
                    </h1>

                    <div style={{ color: '#888', fontSize: '13px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                        Posted by <strong>{item.writer?.name}</strong> · {new Date(item.regDate).toLocaleDateString()}
                    </div>
                </div>

                {/* 2. 이미지 영역 */}
                <div style={{ width: '100%', marginBottom: '40px', textAlign: 'center', backgroundColor: '#fafafa', borderRadius:'8px', overflow:'hidden' }}>
                    {item.imagePath ? (
                        <img
                            src={`http://localhost:8081/images/${item.imagePath}`}
                            alt="item"
                            style={{
                                maxWidth:'100%', maxHeight:'600px',
                                filter: item.status==='DONE' ? 'grayscale(100%)' : 'none',
                                transition: 'filter 0.3s', display: 'block', margin: '0 auto'
                            }}
                        />
                    ) : (
                        <div style={{color:'#ccc', padding:'60px 0', fontSize:'14px'}}>NO IMAGE</div>
                    )}
                </div>

                {/* 3. 본문 내용 */}
                <div style={{ minHeight: '100px', whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '16px', color: item.status==='DONE'?'#888':'#333', marginBottom: '40px' }}>
                    {item.content}
                </div>

                {/* ★ 4. 작성자 전용 컨트롤 패널 (예쁜 버튼 부활!) */}
                {isWriter && (
                    <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}>⚙️ 작성자 메뉴</span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {/* 상태 변경 버튼 (토글 스타일) */}
                            <button
                                onClick={toggleStatus}
                                style={{
                                    padding: '10px 20px', cursor: 'pointer',
                                    border: item.status === 'ING' ? 'none' : '1px solid #555',
                                    backgroundColor: item.status === 'ING' ? '#555' : 'white',
                                    color: item.status === 'ING' ? 'white' : '#555',
                                    borderRadius: '5px', fontWeight: 'bold',
                                    transition: 'all 0.3s'
                                }}>
                                {item.status === 'ING' ? '✅ 해결 완료로 변경' : '🔄 다시 찾는 중으로'}
                            </button>

                            {/* 삭제 버튼 */}
                            <button
                                onClick={handleDelete}
                                style={{ padding: '10px 20px', cursor: 'pointer', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
                                🗑 삭제
                            </button>
                        </div>
                    </div>
                )}

                {/* ★ 5. 연락처/카톡 표시 영역 (아까 고친 로직 + 예쁜 디자인) */}
                {!isWriter && item.status !== 'DONE' && (
                    <div style={{ textAlign: 'center', marginTop: '40px', borderTop:'1px solid #eee', paddingTop:'30px' }}>

                        {/* Case 1: 카톡 링크가 있으면 -> 카톡 버튼 */}
                        {item.kakaoLink && item.kakaoLink.trim() !== "" ? (
                            <a href={item.kakaoLink} target="_blank" rel="noreferrer"
                               style={{ display: 'inline-block', padding: '15px 40px', backgroundColor: '#FAE100', color: '#3B1E1E', textDecoration: 'none', fontWeight: 'bold', borderRadius: '50px', fontSize:'16px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                💬 1:1 카카오톡으로 연락하기
                            </a>
                        ) : (
                            /* Case 2: 전화번호 공개 동의 시 -> 파란 박스 */
                            isPhonePublic ? (
                                <div style={{ padding:'20px 40px', background:'#f0f8ff', borderRadius:'10px', display:'inline-block', border:'1px solid #add8e6' }}>
                                    <div style={{fontSize:'12px', color:'#555', marginBottom:'5px', textTransform:'uppercase', letterSpacing:'1px'}}>Contact</div>
                                    <div style={{fontSize:'20px', fontWeight:'bold', color:'#000'}}>
                                        {currentUser ? item.writer?.phoneNumber : '🔒 로그인 후 확인 가능'}
                                    </div>
                                </div>
                            ) : (
                                /* Case 3: 둘 다 없음 -> 비밀댓글 안내 */
                                <div style={{ padding:'20px', background:'#f9f9f9', borderRadius:'10px', color:'#666', display:'inline-block', fontSize:'14px' }}>
                                    <span style={{display:'block', marginBottom:'5px', fontSize:'20px'}}>🔕</span>
                                    작성자가 연락처를 비공개했습니다.<br/>
                                    아래 <b>비밀 댓글</b>을 남겨 소통해주세요.
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>

            {/* 댓글 영역 (디자인 유지) */}
            <div style={{ marginTop: '60px' }}>
                <h3 style={{borderBottom:'2px solid #333', paddingBottom:'10px', display:'inline-block', margin:'0 0 20px 0'}}>COMMENTS ({comments.length})</h3>

                {/* 댓글 입력창 */}
                <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '15px', marginBottom: '30px', alignItems: 'flex-start', background:'#fff', padding:'20px', border:'1px solid #eee', borderRadius:'8px' }}>
          <textarea
              placeholder={currentUser ? "댓글을 입력하세요. (습득 장소, 연락처 등)" : "로그인 후 댓글을 남길 수 있습니다."}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              disabled={!currentUser}
              style={{ flex: 1, padding: '10px', height: '50px', borderRadius:'4px', border:'1px solid #ddd', resize:'none', fontFamily:'inherit', fontSize:'14px' }}
          />
                    <div style={{ textAlign: 'center', width:'80px' }}>
                        <label style={{ fontSize: '12px', cursor: 'pointer', display:'block', marginBottom:'8px', userSelect:'none' }}>
                            <input type="checkbox" checked={isSecret} onChange={(e) => setIsSecret(e.target.checked)} /> 비밀글
                        </label>
                        <button type="submit" disabled={!currentUser} style={{ width:'100%', padding: '10px 0', background: '#333', color: 'white', border: 'none', borderRadius:'4px', cursor: 'pointer', opacity: currentUser ? 1 : 0.5, fontWeight:'bold' }}>
                            등록
                        </button>
                    </div>
                </form>

                {/* 댓글 목록 */}
                <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                    {comments.map((comment) => {
                        const isSecretComment = comment.secret || comment.isSecret;
                        const canSee = currentUser && (currentUser.username === comment.writer?.username || currentUser.username === item.writer?.username);

                        return (
                            <div key={comment.id} style={{ padding: '15px 20px', background: '#fff', border:'1px solid #eee', borderRadius: '8px' }}>
                                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                  <span style={{ fontWeight: 'bold', fontSize:'14px', color:'#333' }}>
                    {comment.writer?.name}
                      {isSecretComment && <span style={{fontSize:'12px', marginLeft:'6px'}} title="비밀글">🔒</span>}
                  </span>
                                    <span style={{ fontSize: '12px', color: '#aaa' }}>{new Date(comment.regDate).toLocaleString()}</span>
                                </div>
                                <div style={{ fontSize: '14px', color: '#555', lineHeight:'1.5' }}>
                                    {isSecretComment && !canSee ? (
                                        <span style={{ color: '#bbb' }}>🔒 비밀 댓글입니다.</span>
                                    ) : (
                                        comment.content
                                    )}
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