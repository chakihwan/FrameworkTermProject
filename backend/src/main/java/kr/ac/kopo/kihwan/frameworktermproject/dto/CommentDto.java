package kr.ac.kopo.kihwan.frameworktermproject.dto;

import lombok.Data;

@Data
public class CommentDto {
    private Long itemId;      // 원글 번호
    private String content;   // 내용
    private String username;  // 작성자 ID
    private boolean isSecret; // 비밀글 체크 여부
}
