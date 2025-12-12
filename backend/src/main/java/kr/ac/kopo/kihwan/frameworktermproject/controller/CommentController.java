package kr.ac.kopo.kihwan.frameworktermproject.controller;

import kr.ac.kopo.kihwan.frameworktermproject.domain.Comment;
import kr.ac.kopo.kihwan.frameworktermproject.dto.CommentDto;
import kr.ac.kopo.kihwan.frameworktermproject.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // 댓글 쓰기
    @PostMapping
    public Comment addComment(@RequestBody CommentDto dto) {
        return commentService.addComment(dto);
    }

    // 특정 글의 댓글 목록 조회
    @GetMapping("/{itemId}")
    public List<Comment> getComments(@PathVariable Long itemId) {
        return commentService.getComments(itemId);
    }

    // 댓글 삭제 API
    // (DELETE 요청은 Body를 잘 안 쓰지만, axios에서는 data 옵션으로 보낼 수 있음)
    @DeleteMapping("/{commentId}")
    public void deleteComment(@PathVariable Long commentId, @RequestBody java.util.Map<String, String> body) {
        commentService.deleteComment(commentId, body.get("username"));
    }
}