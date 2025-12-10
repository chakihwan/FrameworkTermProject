import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ItemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [comments, setComments] = useState([]); // 댓글 목록
    const [commentContent, setCommentContent] = useState(''); // 입력한 댓글
    const [isSecret, setIsSecret] = useState(false); // 비밀글 체크 여부

    const currentUser = JSON.parse(localStorage.getItem('user'));

    // 1. 글 정보 + 댓글 목록 가져오기
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

// 2. 댓글 등록 함수 수정
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

                // ★ [핵심 수정] isSecret 대신 secret 이라고 보내야 백엔드가 알아듣습니다!
                secret: isSecret
            });

            alert('댓글이 등록되었습니다.');
            setCommentContent('');
            setIsSecret(false);
            fetchData(); // 목록 새로고침
        } catch (err) {
            alert('댓글 등록 실패');
        }
    };

    // ... (기존 삭제/상태변경 함수들 생략없이 그대로 둠) ...
    const handleDelete = async () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            await axios.delete(`http://localhost:8081/api/items/${id}`);
            navigate('/');
        }
    };
    const toggleStatus = async () => {
        const newStatus = item.status === 'ING' ? 'DONE' : 'ING';
        await axios.put(`http://localhost:8081/api/items/${id}/status`, { status: newStatus });
        setItem({ ...item, status: newStatus });
    };

    if (!item) return <div>Loading...</div>;
    const isWriter = currentUser && currentUser.username === item.writer?.username;

    return (
        <div style={{ padding: '50px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer' }}>← BACK</button>

            {/* --- 기존 상세 내용 (이미지, 제목, 내용 등) --- */}
            <div style={{ border: '1px solid #eee', padding: '40px', borderRadius:'10px' }}>
                <div style={{textAlign:'center', marginBottom:'30px'}}>
                    {item.imagePath ? <img src={`http://localhost:8081/images/${item.imagePath}`} style={{maxWidth:'100%', maxHeight:'400px'}} /> : 'NO IMAGE'}
                </div>
                <span className={`tag ${item.itemType==='LOST'?'lost':'found'}`}>{item.itemType}</span>
                <h2>{item.title}</h2>
                <div style={{borderBottom:'1px solid #eee', paddingBottom:'20px', marginBottom:'20px', color:'#888'}}>
                    Posted by {item.writer?.name} / {item.writer?.phoneNumber}
                </div>
                <div style={{minHeight:'100px', whiteSpace:'pre-wrap'}}>{item.content}</div>

                {/* 작성자 버튼들 */}
                {isWriter && (
                    <div style={{marginTop:'20px', textAlign:'right'}}>
                        <button onClick={toggleStatus} style={{marginRight:'10px'}}>상태변경</button>
                        <button onClick={handleDelete} style={{background:'red', color:'white', border:'none'}}>삭제</button>
                    </div>
                )}
            </div>

            {/* ★★★ 댓글 영역 (여기서부터 추가됨) ★★★ */}
            <div style={{ marginTop: '50px' }}>
                <h3>💬 Comments ({comments.length})</h3>

                {/* 댓글 입력창 */}
                <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '30px', alignItems: 'center' }}>
          <textarea
              placeholder="댓글을 남겨주세요 (연락처 등)"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              style={{ flex: 1, padding: '10px', height: '50px' }}
          />
                    <div style={{ textAlign: 'center' }}>
                        <label style={{ fontSize: '12px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={isSecret}
                                onChange={(e) => setIsSecret(e.target.checked)}
                            />
                            비밀글🔒
                        </label>
                        <br/>
                        <button type="submit" style={{ padding: '8px 20px', background: '#333', color: 'white', border: 'none', marginTop: '5px' }}>
                            등록
                        </button>
                    </div>
                </form>

                {/* 댓글 목록 영역 수정 */}
                <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
                    {comments.map((comment) => {

                        // ★ [수정 포인트 1] 변수명 방어 코딩 ('secret' 또는 'isSecret' 둘 다 확인)
                        const isSecretComment = comment.secret || comment.isSecret;

                        // ★ [디버깅용] F12 콘솔에서 확인해보세요 (나중에 지우셔도 됩니다)
                        console.log("댓글 데이터:", comment, "비밀여부:", isSecretComment);

                        // 볼 수 있는 사람: 로그인한 유저가 있고 && (댓글 쓴 사람이거나 OR 글 쓴 사람이거나)
                        const canSee = currentUser && (
                            currentUser.username === comment.writer?.username ||
                            currentUser.username === item.writer?.username
                        );

                        return (
                            <div key={comment.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
                                    {comment.writer?.name}
                                    {/* 비밀글이면 자물쇠 아이콘 표시 */}
                                    {isSecretComment && <span style={{color:'red', marginLeft:'5px'}}>🔒</span>}

                                    <span style={{ fontWeight: 'normal', color: '#aaa', marginLeft: '10px' }}>
                    {new Date(comment.regDate).toLocaleDateString()}
                  </span>
                                </div>

                                <div style={{ fontSize: '14px', color: '#555' }}>
                                    {/* ★ [수정 포인트 2] 비밀글 로직 적용 */}
                                    {isSecretComment && !canSee ? (
                                        <span style={{ color: '#aaa', fontStyle: 'italic' }}>
                      🔒 비밀 댓글입니다. (작성자와 글쓴이만 볼 수 있습니다)
                    </span>
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