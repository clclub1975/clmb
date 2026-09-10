function extractPdfFiles() {
  // 현재 '촛불 회보 PDFs' 폴더 ID
  const FOLDER_ID = '1y7czccz6GjtC7zauk8bEjcgmrW3IZHZo';
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  sheet.clear();
  sheet.appendRow(['파일명', '파일ID', '미리보기 링크']);
  
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const files = folder.getFiles();
  const rows = [];
  
  while (files.hasNext()) {
    const file = files.next();
    const name = file.getName();
    
    // 방금 만든 구글 시트 파일 자신은 목록에서 제외하고 PDF만 수집
    if (name.toLowerCase().endsWith('.pdf')) {
      const id = file.getId();
      const previewUrl = `https://drive.google.com/file/d/${id}/preview`;
      rows.push([name, id, previewUrl]);
    }
  }
  
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 3).setValues(rows);
  }
}
