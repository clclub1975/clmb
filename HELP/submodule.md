```markdown
# 🧩 AI 협업 단일 파일(Single File) 웹 앱 모듈화 개발 표준 규약

단일 HTML 파일 배포를 목표로 하면서도, 개발 단계에서는 자식 모듈을 독립적으로 개발하고 최종 병합 시 **AI의 임의 레이아웃 왜곡 및 무한 디버깅을 원천 차단**하기 위한 표준 개발 절차입니다.

---

## 1. 3개 구역 샌드박스 주석 격리 규격 (Child Module)

독립 테스트용 파일(예: `artcorrect.html`)을 작성할 때는 스타일, 마크업, 스크립트 영역을 반드시 아래의 **표준 주석 블록**으로 감싸서 작성합니다.

```html
<!-- === [MODULE-STYLE: 모듈 스타일 시작] === -->
<style>
  /* 모듈 전용 CSS (부모 스타일과 충돌하지 않도록 모듈 전용 네임스페이스/클래스 사용) */
  .editor-modal-backdrop { ... }
  .editor-container { ... }
</style>
<!-- === [MODULE-STYLE: 모듈 스타일 끝] === -->

<!-- === [MODULE-HTML: 모듈 마크업 시작] === -->
<div class="editor-modal-backdrop" id="editorModalBackdrop">
  <!-- 모달 내부 UI 마크업 전체 -->
</div>
<!-- === [MODULE-HTML: 모듈 마크업 끝] === -->

<!-- === [MODULE-SCRIPT: 모듈 로직 시작] === -->
<script>
  // 모듈 전용 상태 및 로직 전체
  let isDirty = false;
  function handleSaveAction(actionType) { ... }
</script>
<!-- === [MODULE-SCRIPT: 모듈 로직 끝] === -->

```

---

## 2. 부모-자식 간 인터페이스 고정 규격 (Interface Contract)

부모 페이지(`articles.html`)와 자식 모듈(`artcorrect.html`) 간의 데이터 교환 통로는 복잡하게 얽히지 않도록 단 2개의 함수(진입/종료)로 제한합니다.

1. **진입 함수 (Parent ➔ Child)**:
```javascript
function openInlineEditor(targetId, initialData) {
  // 1. 모듈 열기 및 초기 데이터 바인딩
  // 2. 필요 시 온디맨드 fetch 실행
}

```


2. **종료 콜백 함수 (Child ➔ Parent)**:
```javascript
function closeEditorModal(isSaved, updatedPayload) {
  // 1. 모달 닫기
  // 2. 저장이 발생한 경우 부모 뷰어/캐시 즉시 동기화
}

```



---

## 3. 1:1 치환(Replace) 프롬프트 템플릿

자식 모듈의 디버깅이 완전히 끝난 후, 부모 단일 파일에 코드를 병합할 때는 "합쳐줘"라고 지시하지 않고 아래 **치환 프롬프트**를 그대로 복사하여 AI에게 전달합니다.

```text
[명령: 모듈 1:1 완전 치환 작업]

부모 파일(articles.html)의 모달 영역을 최신 자식 파일(artcorrect.html)의 코드로 1:1 완전 교체(Replace)해줘.

1. CSS 치환:
   - articles.html 내의 /* === [MODULE-STYLE] === */ 구역을 artcorrect.html의 스타일로 100% 동일하게 덮어써줘.
2. HTML 치환:
   - articles.html 내의 <!-- === [MODULE-HTML] === --> 구역을 artcorrect.html의 마크업으로 교체해줘.
3. JS 치환:
   - articles.html 내의 // === [MODULE-SCRIPT] === 구역을 artcorrect.html의 스크립트로 교체해줘.

[엄격 준수 규칙]
- artcorrect.html에 구현된 클래스명, HTML 태그 순서, 버튼 텍스트, 여백, 인라인 스타일을 단 1글자도 임의로 축약하거나 변경하지 마.
- 창의적으로 코드를 최적화하거나 재해석하지 말고, 기재된 블록 단위 그대로 정밀 이식만 수행해.
- 메인 타이틀 배지 버전을 1단계 올리고 최상단 첫 줄 커밋 리마크를 작성해줘.

```

---

## 4. 작업 프로세스 흐름 요약

```text
[독립 테스트 파일 작성] (예: artcorrect.html)
        │
        ├── 3개 샌드박스 주석 블록으로 구조화
        ├── 경량 데이터로 UI/버튼/동작 고속 디버깅 (토큰 절약 & 3초 초고속 생성)
        │
[검증 완료]
        │
        └── '1:1 치환 프롬프트'를 통해 부모 파일(articles.html)에 딸깍 병합
                │
                └── 레이아웃 왜곡 없는 단일 완성 파일 배포 완료

```

```

```
