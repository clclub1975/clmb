var files = [];

// 화면에 있는 요소들 중 파일 ID(data-id)를 가진 것을 모두 찾습니다.
document.querySelectorAll('div[data-id]').forEach(el => {
    var id = el.getAttribute('data-id');
   
    // 유효한 ID인지 길이로 확인
    if (id && id.length > 20) {
        var text = el.innerText || el.getAttribute('aria-label') || '';
       
        // 구글 드라이브 목록 텍스트에서 첫 줄(파일명)만 깔끔하게 분리
        var fileName = text.split('\n')[0].trim();
       
        // 중복 방지 및 빈 이름 방지
        if (fileName && !files.some(f => f.id === id)) {
            files.push({ id: id, name: fileName });
        }
    }
});

var output = "=== 복사해서 사용하세요 ===\n\n";

if (files.length > 0) {
    // 모든 파일들의 '파일명 - 전체 링크' 출력 (첫 줄 고정 출력 제거)
    files.forEach(f => {
        output += `${f.name} - https://drive.google.com/file/d/${f.id}/view?usp=sharing\n`;
    });
} else {
    output = "파일을 찾지 못했습니다. 화면에 파일 목록이 보이게 스크롤을 움직인 후 다시 시도해 보세요.";
}

console.log(output);

