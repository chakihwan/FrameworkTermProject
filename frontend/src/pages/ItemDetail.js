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

    // 상태 변경 기능 (디자인 개선)
    const toggleStatus = async () => {
        // 1. 바꿀 상태 결정
        const newStatus = item.status === 'ING' ? 'DONE' : 'ING';
        const confirmMsg = newStatus === 'DONE'
            ? "물건을 찾으셨나요? '해결됨' 상태로 변경합니다."
            : "다시 '찾는 중' 상태로 변경하시겠습니까?";

        if (window.confirm(confirmMsg)) {
            try {
                // 2. 서버에 요청
                await axios.put(`http://localhost:8081/api/items/${id}/status`, { status: newStatus });

                // 3. ★ 핵심: 화면 즉시 갱신 (새로고침 없이)
                setItem({ ...item, status: newStatus });
                alert(`상태가 [${newStatus === 'DONE' ? '해결됨' : '찾는 중'}]으로 변경되었습니다.`);
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

    return (
        <div style={{ padding: '50px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer', color:'#888' }}>← BACK TO LIST</button>

            {/* 상세 카드 영역 */}
            <div style={{ border: '1px solid #eee', padding: '40px', borderRadius:'15px', boxShadow:'0 10px 30px rgba(0,0,0,0.05)', position:'relative', overflow:'hidden' }}>

                {/* ★ 해결됨 상태일 때 배경에 'SOLVED' 도장 찍기 (시각적 효과) */}
                {item.status === 'DONE' && (
                    <div style={{
                        position: 'absolute', top: '20px', right: '20px',
                        border: '2px solid #ccc', color: '#ccc',
                        fontSize: '20px', fontWeight: 'bold', padding: '5px 15px',
                        transform: 'rotate(-15deg)', zIndex: 0, pointerEvents: 'none'
                    }}>
                        SOLVED
                    </div>
                )}

                {/* 이미지 영역 */}
                <div style={{ width: '100%', marginBottom: '30px', textAlign: 'center', backgroundColor: '#f8f8f8', borderRadius:'8px', padding:'20px' }}>
                    {item.imagePath ? (
                        <img
                            src={`http://localhost:8081/images/${item.imagePath}`}
                            alt="item"
                            style={{ maxWidth:'100%', maxHeight:'500px', filter: item.status==='DONE' ? 'grayscale(100%)' : 'none', transition: 'filter 0.3s' }}
                        />
                    ) : (
                        <div style={{color:'#ccc', padding:'50px'}}>NO IMAGE</div>
                    )}
                </div>

                {/* 태그 및 제목 */}
                <div style={{position:'relative', zIndex:1}}>
                    <span className={`tag ${item.itemType==='LOST'?'lost':'found'}`}>{item.itemType}</span>

                    {/* 상태 배지 (현재 상태를 명확히 보여줌) */}
                    <span style={{
                        marginLeft: '10px',
                        padding: '2px 8px',
                        fontSize: '12px',
                        borderRadius: '4px',
                        backgroundColor: item.status === 'DONE' ? '#555' : '#2ecc71',
                        color: 'white'
                    }}>
            {item.status === 'DONE' ? '해결 완료' : '찾는 중'}
          </span>

                    <h2 style={{ fontSize: '28px', margin: '15px 0', color: item.status==='DONE'?'#aaa':'#000', textDecoration: item.status==='DONE'?'line-through':'none' }}>
                        {item.title}
                    </h2>

                    <div style={{borderBottom:'1px solid #eee', paddingBottom:'20px', marginBottom:'20px', color:'#888', fontSize:'14px'}}>
                        Posted by <strong>{item.writer?.name}</strong> · {new Date(item.regDate).toLocaleDateString()}
                    </div>

                    <div style={{minHeight:'100px', whiteSpace:'pre-wrap', lineHeight:'1.6', color: item.status==='DONE'?'#888':'#333'}}>
                        {item.content}
                    </div>
                </div>

                {/* ★ 작성자 전용 컨트롤 패널 (디자인 개선) */}
                {isWriter && (
                    <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f1f1f1', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}>⚙️ 작성자 메뉴</span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {/* 상태 변경 버튼 (토글 스타일) */}
                            <button
                                onClick={toggleStatus}
                                style={{
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    border: item.status === 'ING' ? 'none' : '1px solid #555',
                                    backgroundColor: item.status === 'ING' ? '#555' : 'white',
                                    color: item.status === 'ING' ? 'white' : '#555',
                                    borderRadius: '5px',
                                    fontWeight: 'bold',
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

                {/* 카톡 문의 버튼 (해결 안 됐을 때만 보임) */}
                {!isWriter && item.status !== 'DONE' && (
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        {item.kakaoLink ? (
                            <a href={item.kakaoLink} target="_blank" rel="noreferrer" style={{ display: 'inline-block', padding: '15px 30px', backgroundColor: '#FAE100', color: '#3B1E1E', textDecoration: 'none', fontWeight: 'bold', borderRadius: '30px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                💬 1:1 카카오톡 문의하기
                            </a>
                        ) : (
                            <div style={{ padding:'15px', background:'#f9f9f9', borderRadius:'8px', color:'#666' }}>
                                연락처: {currentUser ? item.writer?.phoneNumber : '로그인 후 확인 가능'}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 댓글 영역 */}
            <div style={{ marginTop: '50px' }}>
                <h3 style={{borderBottom:'2px solid #000', paddingBottom:'10px', display:'inline-block'}}>COMMENTS ({comments.length})</h3>

                {/* 댓글 입력창 */}
                <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '10px', margin: '20px 0', alignItems: 'flex-start' }}>
          <textarea
              placeholder={currentUser ? "댓글을 남겨주세요." : "로그인 후 댓글을 남길 수 있습니다."}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              disabled={!currentUser}
              style={{ flex: 1, padding: '15px', height: '60px', borderRadius:'8px', border:'1px solid #ddd', resize:'none', fontFamily:'inherit' }}
          />
                    <div style={{ textAlign: 'center' }}>
                        <label style={{ fontSize: '12px', cursor: 'pointer', display:'block', marginBottom:'5px' }}>
                            <input type="checkbox" checked={isSecret} onChange={(e) => setIsSecret(e.target.checked)} /> 비밀글
                        </label>
                        <button type="submit" disabled={!currentUser} style={{ padding: '10px 20px', background: '#000', color: 'white', border: 'none', borderRadius:'5px', cursor: 'pointer', opacity: currentUser ? 1 : 0.5 }}>
                            등록
                        </button>
                    </div>
                </form>

                {/* 댓글 목록 */}
                <div style={{ display:'flex', flexDirection:'column', gap:'15px' }}>
                    {comments.map((comment) => {
                        const isSecretComment = comment.secret || comment.isSecret;
                        const canSee = currentUser && (currentUser.username === comment.writer?.username || currentUser.username === item.writer?.username);

                        return (
                            <div key={comment.id} style={{ padding: '15px', background: '#f8f8f8', borderRadius: '8px' }}>
                                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
                  <span style={{ fontWeight: 'bold', fontSize:'13px' }}>
                    {comment.writer?.name}
                      {isSecretComment && <span style={{fontSize:'12px', marginLeft:'5px'}}>🔒</span>}
                  </span>
                                    <span style={{ fontSize: '11px', color: '#999' }}>{new Date(comment.regDate).toLocaleDateString()}</span>
                                </div>
                                <div style={{ fontSize: '14px', color: '#444', lineHeight:'1.5' }}>
                                    {isSecretComment && !canSee ? (
                                        <span style={{ color: '#aaa' }}>🔒 비밀 댓글입니다.</span>
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