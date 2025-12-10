package kr.ac.kopo.kihwan.frameworktermproject.domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Member {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 1. 로그인용 아이디 (중복 불가)
    @Column(unique = true, nullable = false)
    private String username;

    // 2. 비밀번호
    @Column(nullable = false)
    private String password;

    // 3. 학번 (필수 입력, 중복 불가)
    @Column(unique = true, nullable = false)
    private String studentId;

    // 4. 이름
    private String name;

    // 5. 전화번호
    private String phoneNumber;
}
