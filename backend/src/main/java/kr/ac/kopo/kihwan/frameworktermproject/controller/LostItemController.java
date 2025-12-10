package kr.ac.kopo.kihwan.frameworktermproject.controller;

import kr.ac.kopo.kihwan.frameworktermproject.domain.ItemStatus;
import kr.ac.kopo.kihwan.frameworktermproject.domain.LostItem;
import kr.ac.kopo.kihwan.frameworktermproject.dto.LostItemDto;
import kr.ac.kopo.kihwan.frameworktermproject.service.LostItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class LostItemController {

    private final LostItemService lostItemService;

    // 글 쓰기
    @PostMapping
    public LostItem create(@RequestBody LostItemDto dto) {
        return lostItemService.createItem(dto);
    }

    // 목록 조회
    @GetMapping
    public List<LostItem> list() {
        return lostItemService.getAllItems();
    }

    @GetMapping("/{id}")
    public LostItem getItem(@PathVariable Long id) {
        return lostItemService.getItem(id);
    }

    // 삭제 API (DELETE /api/items/{id})
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        lostItemService.deleteItem(id);
    }

    // 상태 변경 API (PUT /api/items/{id}/status)
    // 요청 데이터 예시: { "status": "DONE" }
    @PutMapping("/{id}/status")
    public LostItem updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        ItemStatus status = ItemStatus.valueOf(statusStr); // 문자열("DONE")을 Enum으로 변환
        return lostItemService.updateStatus(id, status);
    }

    // 목록 조회 + 검색 기능 통합 (GET /api/items?keyword=에어팟)
    @GetMapping
    public List<LostItem> list(@RequestParam(required = false) String keyword) {
        if (keyword != null && !keyword.isEmpty()) {
            // 검색어가 있으면 검색 결과 리턴
            return lostItemService.searchItems(keyword);
        } else {
            // 검색어가 없으면 전체 목록 리턴
            return lostItemService.getAllItems();
        }
    }
}