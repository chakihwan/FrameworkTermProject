package kr.ac.kopo.kihwan.frameworktermproject.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Data
public class LostItem {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000) // 내용을 좀 길게 적을 수 있도록
    private String content;

    private String itemType; // LOST, FOUND

    // ★ 변경됨: 문자열 대신 Enum 사용 (DB에는 "ING", "DONE" 문자열로 저장됨)
    @Enumerated(EnumType.STRING)
    private ItemStatus status;

    // 사진 파일 경로 (필수 아님 -> nullable = true)
    // 나중에 사진 업로드 기능 구현할 때 여기에 파일 경로가 저장
    @Column(nullable = true)
    private String imagePath;

    @CreationTimestamp
    private LocalDateTime regDate;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member writer;

    // 추가: 카카오톡 오픈채팅 링크 저장할 칸
    @Column(nullable = true)
    private String kakaoLink;
}
