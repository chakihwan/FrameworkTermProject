package kr.ac.kopo.kihwan.frameworktermproject.repository;

import kr.ac.kopo.kihwan.frameworktermproject.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    // 특정 게시글(itemId)에 달린 댓글을 모두 가져오기 (최신순 등 정렬 필요하면 여기에)
    List<Comment> findByLostItemId(Long itemId);
}
