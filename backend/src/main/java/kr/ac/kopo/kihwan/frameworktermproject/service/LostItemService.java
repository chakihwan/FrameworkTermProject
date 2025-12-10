package kr.ac.kopo.kihwan.frameworktermproject.service;

import kr.ac.kopo.kihwan.frameworktermproject.domain.ItemStatus;
import kr.ac.kopo.kihwan.frameworktermproject.dto.LostItemDto;
// ★ 중요: 엔티티 패키지명이 domain이면 .entity 대신 .domain 으로 수정!
import kr.ac.kopo.kihwan.frameworktermproject.domain.LostItem;
import kr.ac.kopo.kihwan.frameworktermproject.domain.Member;
import kr.ac.kopo.kihwan.frameworktermproject.repository.LostItemRepository;
import kr.ac.kopo.kihwan.frameworktermproject.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LostItemService {

    private final LostItemRepository lostItemRepository;
    private final MemberRepository memberRepository;

    // 글 쓰기
    @Transactional
    public LostItem createItem(LostItemDto dto) {
        Member writer = memberRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));

        LostItem item = new LostItem();
        item.setTitle(dto.getTitle());
        item.setContent(dto.getContent());
        item.setItemType(dto.getItemType());

        item.setStatus(ItemStatus.ING);
        item.setWriter(writer); // 작성자 연결 (JPA 연관관계)
        // imagePath는 나중에 처리

        return lostItemRepository.save(item);
    }

    // 전체 목록 가져오기
    public List<LostItem> getAllItems() {
        return lostItemRepository.findAllByOrderByRegDateDesc();
    }

    // 상세 조회 (글 하나만 가져오기)
    public LostItem getItem(Long id) {
        return lostItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 글이 없습니다."));
    }

    // 글 삭제
    public void deleteItem(Long id) {
        lostItemRepository.deleteById(id);
    }

    // 상태 변경 (ING <-> DONE)
    @Transactional
    public LostItem updateStatus(Long id, ItemStatus status) {
        LostItem item = lostItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("글이 없습니다."));
        item.setStatus(status);
        return item; // 변경된 정보 리턴
    }

    // 검색 기능 (제목 또는 내용 검색)
    public List<LostItem> searchItems(String keyword) {
        return lostItemRepository.findByTitleContainingOrContentContainingOrderByRegDateDesc(keyword, keyword);
    }
}
