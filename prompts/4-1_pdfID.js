var fileMap = new Map();

// 화면에 있는 요소들 중 파일 ID와 파일명을 찾습니다.
document.querySelectorAll('div[data-id]').forEach(el => {
    var id = el.getAttribute('data-id');
    if (id && id.length > 20) {
        var text = el.getAttribute('aria-label') || el.innerText || '';
       
        // 파일명 추출 (예: 통권001호_OCR.pdf)
        var match = text.match(/(통권\d+호.*\.pdf)/);
        if (match) {
            var fileName = match[1];
            var numMatch = fileName.match(/통권(\d+)호/);
            if (numMatch) {
                var num = parseInt(numMatch[1], 10);
                fileMap.set(num, { id: id, fileName: fileName });
            }
        }
    }
});

// 번호(호수) 순서대로 정렬
var sortedKeys = Array.from(fileMap.keys()).sort((a, b) => a - b);
var output = "";

// 1. 맨 첫 줄에 'full path' 및 1호의 링크 주소 출력
if (fileMap.has(1)) {
    output += `full path\nhttps://drive.google.com/file/d/${fileMap.get(1).id}/view?usp=sharing\n\n`;
}

// 2. 이후 모든 파일들의 '파일명 - 파일 ID' 출력
sortedKeys.forEach(num => {
    var fileInfo = fileMap.get(num);
    output += `${fileInfo.fileName} - ${fileInfo.id}\n`;
});

console.log(output || "파일을 찾지 못했습니다. 화면에 파일 목록이 보이게 스크롤 후 다시 시도해 보세요.");
