package kr.ac.kopo.kihwan.frameworktermproject.service;

import kr.ac.kopo.kihwan.frameworktermproject.dto.LoginRequest;
import kr.ac.kopo.kihwan.frameworktermproject.dto.SignupRequest;
import kr.ac.kopo.kihwan.frameworktermproject.domain.Member;
import kr.ac.kopo.kihwan.frameworktermproject.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder; // 추가됨
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder; // ★ 주입받음 (Config에서 만든 Bean)

    // 회원가입
    @Transactional
    public Member signup(SignupRequest request) {
        if (memberRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("이미 사용 중인 아이디입니다.");
        }

        Member member = new Member();
        member.setUsername(request.getUsername());

        // ★ 핵심 변경: 비밀번호를 그냥 넣지 않고 '암호화'해서 저장함
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        member.setPassword(encodedPassword);

        member.setStudentId(request.getStudentId());
        member.setName(request.getName());
        member.setPhoneNumber(request.getPhoneNumber());

        return memberRepository.save(member);
    }

    // 로그인
    public Member login(LoginRequest request) {
        Optional<Member> optionalMember = memberRepository.findByUsername(request.getUsername());

        if (optionalMember.isPresent()) {
            Member member = optionalMember.get();

            // ★ 핵심 변경: 입력받은 비번(raw)과 DB의 암호비번(encoded)이 일치하는지 확인
            if (passwordEncoder.matches(request.getPassword(), member.getPassword())) {
                return member;
            }
        }
        return null; // 실패
    }

    // ★ [추가] 아이디 찾기 기능
    public String findId(String name, String phoneNumber) {
        Member member = memberRepository.findByNameAndPhoneNumber(name, phoneNumber)
                .orElseThrow(() -> new RuntimeException("일치하는 회원 정보가 없습니다."));
        return member.getUsername();
    }

    // ★ [추가] 비밀번호 재설정 기능
    @Transactional
    public void resetPassword(String username, String name, String phoneNumber, String newPassword) {
        Member member = memberRepository.findByUsernameAndNameAndPhoneNumber(username, name, phoneNumber)
                .orElseThrow(() -> new RuntimeException("입력하신 정보가 회원 정보와 일치하지 않습니다."));

        // 새 비밀번호 암호화 후 저장
        member.setPassword(passwordEncoder.encode(newPassword));
    }
}