package kr.ac.kopo.kihwan.frameworktermproject.repository;

import kr.ac.kopo.kihwan.frameworktermproject.domain.LostItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LostItemRepository extends JpaRepository<LostItem, Long> {
    // 최신순으로 정렬해서 가져오기 (나중에 리스트 화면용)
    List<LostItem> findAllByOrderByRegDateDesc();

    // 제목(Title) 또는 내용(Content)에 검색어(keyword)가 포함된 것 찾기
    List<LostItem> findByTitleContainingOrContentContainingOrderByRegDateDesc(String title, String content);
}
