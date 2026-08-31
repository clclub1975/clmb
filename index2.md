---
layout: default
title: 촛불회보 기고문 검색
---

# 촛불회보 기고문 검색

회보의 발행월, 일련번호, 그리고 기고문 정보를 조회하고 전문을 확인할 수 있습니다.

<div class="search-section" style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
  
  <!-- 1. 메뉴에서 고르기 -->
  <div style="margin-bottom: 15px;">
    <label for="menu-select"><strong>1. 메뉴에서 고르기:</strong></label><br>
    <select id="menu-select" style="width: 100%; max-width: 400px; padding: 8px; margin-top: 5px;">
      <option value="">-- 기수/회차 선택 --</option>
      <option value="001">001호 (1984년 3월호) - 홍길동</option>
      <!-- 필요한 항목들을 옵션으로 추가 -->
    </select>
  </div>

  <!-- 2. 직접 타이핑을 치거나 -->
  <div>
    <label for="direct-input"><strong>2. 직접 타이핑을 치거나:</strong></label><br>
    <input type="text" id="direct-input" placeholder="기수, 이름 또는 키워드를 입력하세요" style="width: 100%; max-width: 400px; padding: 8px; margin-top: 5px;">
  </div>

</div>

## 검색 및 교정 현황 목록

| 기수 | 이름 | 기고문 정보 | 상태 | 링크 |
| :--- | :--- | :--- | :--- | :--- |
| 001호 | 홍길동 | 1984년 3월호 기고문 전문 | 교정완료 | [전문 보기](./articles/001_hong.md) |
| - | - | - | 교정중 | - |
| - | - | - | 교정전 | - |

---

## 기고문 전문 보기
> **선택된 기고문 내용이 이 영역에 동적으로 표시됩니다.**
> (JavaScript를 연동하여 드롭다운 선택이나 검색어 입력 시 아래 영역에 해당 전문 마크다운 내용이나 PDF 링크가 불러와지도록 구성할 수 있습니다.)
