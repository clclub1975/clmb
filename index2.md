---
layout: default
title: 촛불회보 기고문 아카이브
---

# 촛불회보 기고문 아카이브

기수, 기고자, 글 제목을 순서대로 선택하여 원하는 기고문 전문을 확인하세요.

<div style="margin-bottom: 20px; padding: 15px; background: #f6f8fa; border-radius: 6px;">
  <!-- 1단계: 기수 선택 -->
  <label for="cohortSelect" style="font-weight: bold; display: block; margin-bottom: 5px;">1. 기수 선택</label>
  <select id="cohortSelect" style="width: 100%; padding: 8px; margin-bottom: 15px; border-radius: 4px; border: 1px solid #d1d5db;">
    <option value="">-- 기수를 선택하세요 --</option>
  </select>

  <!-- 2단계: 기고자 선택 -->
  <label for="authorSelect" style="font-weight: bold; display: block; margin-bottom: 5px;">2. 기고자 선택</label>
  <select id="authorSelect" style="width: 100%; padding: 8px; margin-bottom: 15px; border-radius: 4px; border: 1px solid #d1d5db;" disabled>
    <option value="">-- 기고자를 선택하세요 --</option>
  </select>

  <!-- 3단계: 기고문 제목 선택 -->
  <label for="articleSelect" style="font-weight: bold; display: block; margin-bottom: 5px;">3. 기고문 선택</label>
  <select id="articleSelect" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #d1d5db;" disabled>
    <option value="">-- 기고문을 선택하세요 --</option>
  </select>
</div>

<h2>기고문 전문 보기</h2>
<div id="articleViewer" style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 6px; background: #ffffff; min-height: 150px; white-space: pre-wrap; line-height: 1.6;">
  선택된 기고문 전문이 이곳에 표시됩니다.
</div>

<script>
  // 구글 시트(또는 별도 목록 시트) 데이터를 연동하기 위한 예시 데이터 구조
  // (실제 운용 시에는 구글 시트를 CSV나 JSON 형태로 불러와서 이 자바스크립트 배열에 연결합니다)
  const articlesData = [
    { id: "CL001-01", cohort: "7기", author: "김민수", title: "월보를 내며", content: "이번 해로 우리 촛불회가 결성된지 횟수로 10년이 됩니다...\n\n(하략)" },
    { id: "CL001-03", cohort: "6기", author: "이준호", title: "한 회기를 보내며", content: "지난 6개월동안 나는 촛불회의 발전을 위해 무엇을 했던가?..." },
    { id: "CL001-04", cohort: "7기", author: "백찬하", title: "촛불로 지새운 밤에", content: "한잔의 커피로\n쓰디쓴 시소를 마시며 우린\n걸음을 이야기 했고\n자욱한 담배 연기를 뿌리며 우린..." }
  ];

  const cohortSelect = document.getElementById('cohortSelect');
  const authorSelect = document.getElementById('authorSelect');
  const articleSelect = document.getElementById('articleSelect');
  const articleViewer = document.getElementById('articleViewer');

  // 초기 기수 목록 세팅 (중복 제거)
  const cohorts = [...new Set(articlesData.map(item => item.cohort))];
  cohorts.forEach(cohort => {
    const option = document.createElement('option');
    option.value = cohort;
    option.textContent = cohort;
    cohortSelect.appendChild(option);
  });

  // 1단계: 기수 선택 시
  cohortSelect.addEventListener('change', function() {
    const selectedCohort = this.value;
    authorSelect.innerHTML = '<option value="">-- 기고자를 선택하세요 --</option>';
    articleSelect.innerHTML = '<option value="">-- 기고문을 선택하세요 --</option>';
    authorSelect.disabled = !selectedCohort;
    articleSelect.disabled = true;
    articleViewer.textContent = '선택된 기고문 전문이 이곳에 표시됩니다.';

    if (!selectedCohort) return;

    const filteredAuthors = [...new Set(articlesData.filter(item => item.cohort === selectedCohort).map(item => item.author))];
    filteredAuthors.forEach(author => {
      const option = document.createElement('option');
      option.value = author;
      option.textContent = author;
      authorSelect.appendChild(option);
    });
  });

  // 2단계: 기고자 선택 시
  authorSelect.addEventListener('change', function() {
    const selectedCohort = cohortSelect.value;
    const selectedAuthor = this.value;
    articleSelect.innerHTML = '<option value="">-- 기고문을 선택하세요 --</option>';
    articleSelect.disabled = !selectedAuthor;
    articleViewer.textContent = '선택된 기고문 전문이 이곳에 표시됩니다.';

    if (!selectedAuthor) return;

    const filteredArticles = articlesData.filter(item => item.cohort === selectedCohort && item.author === selectedAuthor);
    filteredArticles.forEach(article => {
      const option = document.createElement('option');
      option.value = article.id;
      option.textContent = article.title;
      articleSelect.appendChild(option);
    });
  });

  // 3단계: 기고문 선택 시 전문 출력
  articleSelect.addEventListener('change', function() {
    const selectedId = this.value;
    if (!selectedId) {
      articleViewer.textContent = '선택된 기고문 전문이 이곳에 표시됩니다.';
      return;
    }

    const article = articlesData.find(item => item.id === selectedId);
    if (article) {
      articleViewer.textContent = `[${article.title}]\n기고자: ${article.author} (${article.cohort})\n\n${article.content}`;
    }
  });
</script>
