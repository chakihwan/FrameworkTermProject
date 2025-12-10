import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ItemDetail = () => {
    const { id } = useParams(); // 주소창의 id 가져오기
    const navigate = useNavigate();
    const [item, setItem] = useState(null);

    // 현재 로그인한 사용자 정보 (버튼 보여줄지 말지 결정용)
    const currentUser = JSON.parse(localStorage.getItem('user'));

    // 1. 글 상세 정보 가져오기
    useEffect(() => {
        axios.get(`http://localhost:8081/api/items/${id}`)
            .then(res => setItem(res.data))
            .catch(err => console.error("데이터 로드 실패:", err));
    }, [id]);

    // 2. 삭제 기능
    const handleDelete = async () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await axios.delete(`http://localhost:8081/api/items/${id}`);
                alert('삭제되었습니다.');
                navigate('/'); // 삭제 후 메인으로 이동
            } catch (err) {
                alert('삭제 실패');
            }
        }
    };

    // 3. 상태 변경 기능 (ING <-> DONE)
    const toggleStatus = async () => {
        const newStatus = item.status === 'ING' ? 'DONE' : 'ING'; // 반대로 변경
        try {
            await axios.put(`http://localhost:8081/api/items/${id}/status`, { status: newStatus });
            // 화면의 상태값도 즉시 업데이트
            setItem({ ...item, status: newStatus });
        } catch (err) {
            alert('상태 변경 실패');
        }
    };

    if (!item) return <div style={{textAlign:'center', marginTop:'50px'}}>Loading...</div>;

    // 글쓴이인지 확인 (로그인했고, 작성자 아이디가 같으면 true)
    const isWriter = currentUser && currentUser.username === item.writer?.username;

    return (
        <div style={{ padding: '50px 20px', maxWidth: '800px', margin: '0 auto' }}>
            {/* 뒤로가기 버튼 */}
            <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>← 뒤로가기</button>

            <div style={{ border: '1px solid #eee', padding: '40px' }}>
                {/* 상태 표시 태그 */}
                <span className={`tag ${item.itemType === 'LOST' ? 'lost' : 'found'}`} style={{ fontSize: '14px' }}>
          {item.itemType}
        </span>

                {/* 상태가 DONE(해결됨)이면 표시 */}
                {item.status === 'DONE' && (
                    <span style={{ marginLeft: '10px', background: '#333', color: 'white', padding: '2px 8px', fontSize: '12px' }}>
            SOLVED (해결됨)
          </span>
                )}

                <h2 style={{ fontSize: '28px', margin: '15px 0' }}>{item.title}</h2>

                <div style={{ color: '#888', fontSize: '14px', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                    Posted by <strong>{item.writer?.name}</strong> on {new Date(item.regDate).toLocaleDateString()}
                </div>

                <div style={{ minHeight: '200px', lineHeight: '1.6', fontSize: '16px' }}>
                    {/* 줄바꿈 문자(\n)를 HTML 줄바꿈으로 처리 */}
                    {item.content.split('\n').map((line, idx) => (
                        <span key={idx}>{line}<br/></span>
                    ))}
                </div>

                {/* 작성자 본인에게만 보이는 버튼들 */}
                {isWriter && (
                    <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '20px', display: 'flex', gap: '10px' }}>
                        <button
                            onClick={toggleStatus}
                            style={{ padding: '10px 20px', cursor: 'pointer', background: 'white', border: '1px solid #333' }}>
                            {item.status === 'ING' ? '✅ 해결 완료로 변경' : '🔄 찾는 중으로 변경'}
                        </button>

                        <button
                            onClick={handleDelete}
                            style={{ padding: '10px 20px', cursor: 'pointer', background: '#d32f2f', color: 'white', border: 'none' }}>
                            🗑 삭제하기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemDetail;