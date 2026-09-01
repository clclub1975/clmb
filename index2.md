<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>촛불회 AI 추억 스토리 생성기</title>
    <style>
        body { font-family: 'Malgun Gothic', sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #333; }
        h1 { color: #2c3e50; text-align: center; }
        .chat-container { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: #f9f9f9; }
        .input-group { display: flex; gap: 10px; margin-top: 20px; }
        input[type="text"] { flex: 1; padding: 12px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px; }
        button { padding: 12px 24px; font-size: 16px; background-color: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background-color: #2980b9; }
        .result-box { margin-top: 20px; padding: 15px; background: white; border: 1px solid #e1e1e1; border-radius: 4px; min-height: 100px; white-space: pre-wrap; }
        .loading { color: #666; font-style: italic; }
    </style>
</head>
<body>

    <h1>🕯️ 촛불회 AI 추억 스토리 생성기</h1>
    
    <div class="chat-container">
        <p>구글 시트의 촛불회보 데이터를 바탕으로 궁금한 점을 물어보세요!</p>
        <div class="input-group">
            <input type="text" id="userQuery" placeholder="예: 통권 5호의 주요 이벤트가 뭐야?" onkeypress="if(event.key === 'Enter') askAI();">
            <button onclick="askAI()">질문하기</button>
        </div>
        
        <h3>AI 답변 결과</h3>
        <div id="aiResult" class="result-box">질문을 입력하고 버튼을 눌러주세요.</div>
    </div>

    <script>
        // 구글 시트 웹에 게시된 CSV 링크
        const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR-cuFQ89zh4t6L-_m_-ktGAYFgVz8lBeyHZFnPK2UDQHOe84sPzBkEdMlj-5tvX-41v9oB7n0B94dP/pub?gid=1769103197&single=true&output=csv";

        // 간단한 CSV 파서 함수
        function parseCSV(text) {
            let lines = text.split("\n");
            let result = [];
            let headers = lines[0].split(",");

            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                let currentLine = lines[i].split(",");
                let obj = {};
                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j].trim()] = currentLine[j] ? currentLine[j].trim() : "";
                }
                result.push(obj);
            }
            return result;
        }

        async function askAI() {
            const query = document.getElementById("userQuery").value.trim();
            const resultBox = document.getElementById("aiResult");

            if (!query) {
                alert("질문을 입력해주세요!");
                return;
            }

            resultBox.innerHTML = "<span class='loading'>데이터를 분석하고 AI 답변을 생성하는 중입니다...</span>";

            try {
                // 1. 구글 시트 CSV 데이터 불러오기
                const response = await fetch(CSV_URL);
                const csvText = await response.text();
                const sheetData = parseCSV(csvText);

                // 2. 데이터 기반 간단 검색 및 응답 시뮬레이션 (추후 LLM API와 연동할 부분)
                // 현재는 시트 내용을 활용해 키워드 매칭 방식으로 답변을 구성합니다.
                let matchedInfo = sheetData.filter(row => JSON.stringify(row).includes(query));

                let answer = "";
                if (matchedInfo.length > 0) {
                    answer = `🔍 관련 촛불회보 데이터를 찾았습니다:\n\n`;
                    matchedInfo.forEach((item, index) => {
                        answer += `- [${item['통권 호수'] || '기록'} / ${item['발행월'] || ''}] ${item['한줄 요약'] || item['주요 이벤트'] || '상세 내용 참조'}\n`;
                    });
                } else {
                    answer = `입력하신 검색어("${query}")와 일치하는 명확한 회보 내용을 시트에서 찾지 못했습니다. 다른 키워드로 질문해 주세요.`;
                }

                resultBox.innerHTML = answer;

            } catch (error) {
                console.error(error);
                resultBox.innerHTML = "데이터를 불러오는 중 오류가 발생했습니다. 네트워크 연결을 확인해 주세요.";
            }
        }
    </script>

</body>
</html>
