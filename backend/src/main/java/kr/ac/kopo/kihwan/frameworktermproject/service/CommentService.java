package kr.ac.kopo.kihwan.frameworktermproject.service;

import kr.ac.kopo.kihwan.frameworktermproject.domain.Comment;
import kr.ac.kopo.kihwan.frameworktermproject.domain.LostItem;
import kr.ac.kopo.kihwan.frameworktermproject.domain.Member;
import kr.ac.kopo.kihwan.frameworktermproject.dto.CommentDto;
import kr.ac.kopo.kihwan.frameworktermproject.repository.CommentRepository;
import kr.ac.kopo.kihwan.frameworktermproject.repository.LostItemRepository;
import kr.ac.kopo.kihwan.frameworktermproject.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final LostItemRepository lostItemRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public Comment addComment(CommentDto dto) {
        LostItem item = lostItemRepository.findById(dto.getItemId())
                .orElseThrow(() -> new RuntimeException("글이 없습니다."));
        Member writer = memberRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("회원 없음"));

        Comment comment = new Comment();
        comment.setContent(dto.getContent());
        comment.setSecret(dto.isSecret());
        comment.setLostItem(item);
        comment.setWriter(writer);

        return commentRepository.save(comment);
    }

    // 댓글 삭제 기능
    public void deleteComment(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 댓글입니다."));

        Member user = memberRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자 정보가 없습니다."));

        // 작성자 본인이거나 관리자(ADMIN)면 삭제 가능
        if (comment.getWriter().getUsername().equals(username) || user.getRole() == kr.ac.kopo.kihwan.frameworktermproject.domain.Role.ADMIN) {
            commentRepository.delete(comment);
        } else {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }
    }

    public List<Comment> getComments(Long itemId) {
        return commentRepository.findByLostItemId(itemId);
    }
}