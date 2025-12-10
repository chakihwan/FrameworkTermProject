package kr.ac.kopo.kihwan.frameworktermproject.controller;

import kr.ac.kopo.kihwan.frameworktermproject.domain.LostItem;
import kr.ac.kopo.kihwan.frameworktermproject.dto.LostItemDto;
import kr.ac.kopo.kihwan.frameworktermproject.service.LostItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
}