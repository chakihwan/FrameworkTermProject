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
            // [디버깅] 콘솔에서 데이터가 어떻게 오는지 확인해보세요!
            console.log("상세 데이터:", itemRes.data);
            setItem(itemRes.data);

            const commentRes = await axios.get(`http://localhost:8081/api/comments/${id}`);
            setComments(commentRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleStatus = async () => {
        const newStatus = item.status === 'ING' ? 'DONE' : 'ING';
        if (window.confirm(newStatus === 'DONE' ? "해결됨으로 변경합니까?" : "찾는 중으로 변경합니까?")) {
            await axios.put(`http://localhost:8081/api/items/${id}/status`, { status: newStatus });
            setItem({ ...item, status: newStatus });
        }
    };

    const handleDelete = async () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            await axios.delete(`http://localhost:8081/api/items/${id}`);
            navigate('/');
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return alert('로그인이 필요합니다.');
        if (!commentContent.trim()) return;

        try {
            await axios.post('http://localhost:8081/api/comments', {
                itemId: id,
                content: commentContent,
                username: currentUser.username,
                secret: isSecret
            });
            alert('댓글 등록 완료');
            setCommentContent('');
            setIsSecret(false);
            fetchData();
        } catch (err) {
            alert('등록 실패');
        }
    };

    if (!item) return <div style={{textAlign:'center', padding:'50px'}}>Loading...</div>;

    const isWriter = currentUser && currentUser.username === item.writer?.username;

    // ★ [핵심 수정] 백엔드에서 isPhoneOpen을 phoneOpen으로 바꿔서 보낼 수 있음. 둘 다 체크!
    const isPhonePublic = item.phoneOpen || item.isPhoneOpen;

    return (
        <div style={{ padding: '50px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer', color:'#888' }}>← BACK TO LIST</button>

            <div style={{ border: '1px solid #eee', padding: '40px', borderRadius:'15px', backgroundColor:'#fff', position:'relative' }}>

                {/* 헤더 (제목, 태그) */}
                <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <span className={`tag ${item.itemType==='LOST'?'lost':'found'}`}>{item.itemType}</span>
                        <span style={{ padding:'2px 8px', fontSize:'12px', borderRadius:'4px', background: item.status==='DONE'?'#555':'#2ecc71', color:'white' }}>
              {item.status==='DONE' ? '해결 완료' : '찾는 중'}
            </span>
                    </div>
                    <h1 style={{ margin: '0 0 10px 0', textDecoration: item.status==='DONE'?'line-through':'none' }}>{item.title}</h1>
                    <div style={{ color: '#888', fontSize: '13px' }}>
                        Posted by <strong>{item.writer?.name}</strong> · {new Date(item.regDate).toLocaleDateString()}
                    </div>
                </div>

                {/* 이미지 */}
                <div style={{ width: '100%', marginBottom: '40px', textAlign: 'center', backgroundColor: '#fafafa', borderRadius:'8px' }}>
                    {item.imagePath ? (
                        <img src={`http://localhost:8081/images/${item.imagePath}`} alt="item" style={{ maxWidth:'100%', maxHeight:'500px' }} />
                    ) : (
                        <div style={{padding:'50px', color:'#ccc'}}>NO IMAGE</div>
                    )}
                </div>

                {/* 내용 */}
                <div style={{ minHeight: '100px', whiteSpace: 'pre-wrap', lineHeight: '1.6', marginBottom: '40px' }}>
                    {item.content}
                </div>

                {/* ★★★ [연락처 표시 로직 완전 수정] ★★★ */}
                {!isWriter && item.status !== 'DONE' && (
                    <div style={{ textAlign: 'center', marginTop: '30px', paddingTop:'30px', borderTop:'1px solid #eee' }}>

                        {/* 우선순위 1: 카톡 링크가 있으면 무조건 카톡 버튼 */}
                        {item.kakaoLink && item.kakaoLink.trim() !== "" ? (
                            <a href={item.kakaoLink} target="_blank" rel="noreferrer"
                               style={{ display: 'inline-block', padding: '15px 40px', backgroundColor: '#FAE100', color: '#3B1E1E', textDecoration: 'none', fontWeight: 'bold', borderRadius: '50px' }}>
                                💬 카카오톡으로 연락하기
                            </a>
                        ) : (
                            /* 우선순위 2: 카톡 없고, 전화번호 공개(isPhonePublic)가 true일 때 */
                            isPhonePublic ? (
                                <div style={{ padding:'20px', background:'#f0f8ff', borderRadius:'8px', display:'inline-block', border:'1px solid #add8e6' }}>
                                    <div style={{fontSize:'12px', color:'#555', marginBottom:'5px'}}>작성자 연락처</div>
                                    <div style={{fontSize:'18px', fontWeight:'bold', letterSpacing:'1px'}}>
                                        {currentUser ? item.writer?.phoneNumber : '🔒 로그인 후 확인 가능'}
                                    </div>
                                </div>
                            ) : (
                                /* 우선순위 3: 둘 다 없을 때 -> 비밀댓글 안내 */
                                <div style={{ padding:'15px', background:'#f9f9f9', borderRadius:'8px', color:'#666', display:'inline-block', fontSize:'13px' }}>
                                    🔕 작성자가 연락처를 비공개했습니다.<br/>
                                    아래 <b>비밀 댓글</b>을 남겨 연락처를 공유해보세요!
                                </div>
                            )
                        )}
                    </div>
                )}

                {/* 작성자 메뉴 */}
                {isWriter && (
                    <div style={{ marginTop:'30px', textAlign:'right' }}>
                        <button onClick={toggleStatus} style={{ marginRight:'10px', padding:'10px' }}>상태변경</button>
                        <button onClick={handleDelete} style={{ background:'red', color:'white', border:'none', padding:'10px' }}>삭제</button>
                    </div>
                )}
            </div>

            {/* 댓글 영역 (기존 코드 유지) */}
            <div style={{ marginTop: '60px' }}>
                <h3>COMMENTS ({comments.length})</h3>
                <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <textarea
              placeholder={currentUser ? "댓글 입력..." : "로그인 필요"}
              value={commentContent} onChange={(e)=>setCommentContent(e.target.value)}
              disabled={!currentUser}
              style={{ flex: 1, padding: '10px', height: '50px' }}
          />
                    <div>
                        <label><input type="checkbox" checked={isSecret} onChange={(e)=>setIsSecret(e.target.checked)}/> 비밀글</label>
                        <button type="submit" disabled={!currentUser} style={{ display:'block', width:'100%', marginTop:'5px', background:'black', color:'white', padding:'5px' }}>등록</button>
                    </div>
                </form>
                <div>
                    {comments.map(c => {
                        const isSecretComment = c.secret || c.isSecret;
                        const canSee = currentUser && (currentUser.username === c.writer?.username || currentUser.username === item.writer?.username);
                        return (
                            <div key={c.id} style={{ padding:'15px', borderBottom:'1px solid #eee' }}>
                                <b>{c.writer?.name}</b> {isSecretComment && '🔒'}
                                <div style={{ color: isSecretComment && !canSee ? '#aaa' : '#333' }}>
                                    {isSecretComment && !canSee ? '비밀 댓글입니다.' : c.content}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default ItemDetail;