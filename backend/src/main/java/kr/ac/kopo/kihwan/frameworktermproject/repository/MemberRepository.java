package kr.ac.kopo.kihwan.frameworktermproject.repository;

import kr.ac.kopo.kihwan.frameworktermproject.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    // 로그인용: 아이디로 회원 찾기
    // Optional은 "회원이 없을 수도 있다"는 걸 명시적으로 처리할 때 좋음
    Optional<Member> findByUsername(String username);

    // 중복 가입 방지용: 이미 있는 학번인지 확인
    boolean existsByStudentId(String studentId);

    // 중복 아이디 방지용
    boolean existsByUsername(String username);

    // ★ [추가] 아이디 찾기용 (이름 + 전화번호로 검색)
    Optional<Member> findByNameAndPhoneNumber(String name, String phoneNumber);

    // ★ [추가] 비밀번호 재설정용 (아이디 + 이름 + 전화번호로 검색)
    Optional<Member> findByUsernameAndNameAndPhoneNumber(String username, String name, String phoneNumber);
}