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

    private String title;       // 제목
    private String content;     // 내용 (장소, 특징 등)

    private String itemType;    // "LOST"(분실) 또는 "FOUND"(습득)
    private String status;      // "ING"(찾는중) 또는 "DONE"(해결됨)

    @CreationTimestamp          // INSERT 될 때 시간 자동 저장 (편함!)
    private LocalDateTime regDate;

    // 작성자 (N:1 관계 - 여러 글은 한 명의 작성자에 속함)
    @ManyToOne
    @JoinColumn(name = "member_id") // DB에는 member_id로 저장됨
    private Member writer;
}
