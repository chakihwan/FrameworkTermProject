package kr.ac.kopo.kihwan.frameworktermproject.dto;

import lombok.Data;

@Data
public class LostItemDto {

    private String title;
    private String content;
    private String itemType;    // LOST(분실), FOUND(습득)
    private String username;    // 작성자 아이디 (누가 썼는지 알기 위해)
    private String kakaoLink;   // 카톡 링크 부가 기능
    private boolean isPhoneOpen;

}
