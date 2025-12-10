package kr.ac.kopo.kihwan.frameworktermproject.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String username;    // 아이디
    private String password;    // 비번
    private String studentId;   // 학번
    private String name;        // 이름
    private String phoneNumber; // 전화번호
}
