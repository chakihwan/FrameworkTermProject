package kr.ac.kopo.kihwan.frameworktermproject.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Data
public class Comment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content; // 댓글 내용

    private boolean isSecret; // ★ 비밀글 여부 (true면 비밀)

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member writer; // 댓글 쓴 사람

    @ManyToOne
    @JoinColumn(name = "lost_item_id")
    private LostItem lostItem; // 어느 글에 달린 댓글인지

    @CreationTimestamp
    private LocalDateTime regDate;
}