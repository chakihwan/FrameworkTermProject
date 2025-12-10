package kr.ac.kopo.kihwan.frameworktermproject.controller;

import kr.ac.kopo.kihwan.frameworktermproject.dto.LoginRequest;
import kr.ac.kopo.kihwan.frameworktermproject.dto.SignupRequest;
import kr.ac.kopo.kihwan.frameworktermproject.domain.Member; // domain이면 수정 필요
import kr.ac.kopo.kihwan.frameworktermproject.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // 리액트 포트 허용
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            Member member = memberService.signup(request);
            return ResponseEntity.ok(member);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Member member = memberService.login(request);
        if (member != null) {
            return ResponseEntity.ok(member);
        } else {
            return ResponseEntity.status(401).body("로그인 실패");
        }
    }
}