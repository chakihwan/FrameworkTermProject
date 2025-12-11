package kr.ac.kopo.kihwan.frameworktermproject.controller;

import kr.ac.kopo.kihwan.frameworktermproject.dto.LoginRequest;
import kr.ac.kopo.kihwan.frameworktermproject.dto.SignupRequest;
import kr.ac.kopo.kihwan.frameworktermproject.domain.Member; // domain이면 수정 필요
import kr.ac.kopo.kihwan.frameworktermproject.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // 리액트 포트 허용
public class MemberController {

    private final MemberService memberService;

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            Member member = memberService.signup(request);
            return ResponseEntity.ok(member);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Member member = memberService.login(request);
        if (member != null) {
            return ResponseEntity.ok(member);
        } else {
            return ResponseEntity.status(401).body("로그인 실패");
        }
    }

    // ★ [추가] 아이디 찾기 연결
    @PostMapping("/find-id")
    public ResponseEntity<String> findId(@RequestBody Map<String, String> request) {
        try {
            String foundId = memberService.findId(request.get("name"), request.get("phoneNumber"));
            return ResponseEntity.ok(foundId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("정보를 찾을 수 없습니다.");
        }
    }

    // ★ [추가] 비밀번호 재설정 연결
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        try {
            memberService.resetPassword(
                    request.get("username"),
                    request.get("name"),
                    request.get("phoneNumber"),
                    request.get("newPassword")
            );
            return ResponseEntity.ok("비밀번호 변경 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("정보가 일치하지 않습니다.");
        }
    }
}