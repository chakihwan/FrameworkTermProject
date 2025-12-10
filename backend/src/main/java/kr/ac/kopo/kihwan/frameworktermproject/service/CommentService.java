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

    public List<Comment> getComments(Long itemId) {
        return commentRepository.findByLostItemId(itemId);
    }
}