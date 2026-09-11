/**
 * 촛불회 50년사 캘린더 백엔드 API (GAS) v11.2
 * - 설정!B2(관리자 암호) 및 설정!B3(등록 가능자 명단) 복합 검증
 * - 신규 등록(NEW), 수정(EDIT), 삭제 요청(DELETE) 지원
 */

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('[캘린더 관리]')
    .addItem('대기 중인 요청 일괄 승인/병합', 'processPendingRequests')
    .addToUi();
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    if (!lock.tryLock(10000)) {
      return responseJSON({ status: 'error', message: '서버가 혼잡합니다. 잠시 후 다시 시도해 주세요.' });
    }

    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var mainSheet = ss.getSheetByName('이벤트DB');
    var requestSheet = ss.getSheetByName('이벤트요청');
    var configSheet = ss.getSheetByName('설정');

    if (!mainSheet) {
      return responseJSON({ status: 'error', message: '이벤트DB 시트를 찾을 수 없습니다.' });
    }

    var currentMode = 'AUTO';
    var correctAdminPw = '';
    var allowedAuthorsStr = '';

    if (configSheet) {
      var modeVal = configSheet.getRange('B1').getValue();
      if (modeVal) currentMode = String(modeVal).trim().toUpperCase();

      var pwVal = configSheet.getRange('B2').getValue();
      if (pwVal !== undefined && pwVal !== null) correctAdminPw = String(pwVal).trim();

      var authVal = configSheet.getRange('B3').getValue();
      if (authVal !== undefined && authVal !== null) allowedAuthorsStr = String(authVal).trim();
    }

    var userProvidedPw = String(data.adminPassword || '').trim();
    var authorName = String(data.author || '').trim();

    // 1. 관리자 암호 검증
    if (correctAdminPw && userProvidedPw !== correctAdminPw) {
      lock.releaseLock();
      return responseJSON({ status: 'error', message: '관리자 비밀번호가 일치하지 않습니다.' });
    }

    // 2. 등록 가능자 명단(설정!B3) 검증
    if (!authorName) {
      lock.releaseLock();
      return responseJSON({ status: 'error', message: '등록자 성명을 입력해주세요.' });
    }

    if (allowedAuthorsStr) {
      var allowedList = allowedAuthorsStr.split(',').map(function(name) { return name.trim(); });
      if (!allowedList.includes(authorName)) {
        lock.releaseLock();
        return responseJSON({ status: 'error', message: '등록 권한이 없는 성명입니다. (설정된 명단 확인 필요)' });
      }
    }

    var action = data.action || 'NEW';

    // 삭제 요청
    if (action === 'DELETE') {
      if (requestSheet) {
        requestSheet.appendRow([
          new Date(), '삭제', data.dateStr, data.seq,
          data.category || '', data.title || '', data.place || '',
          data.note || '', data.attendees || '', authorName + ' (삭제요청)', '대기'
        ]);
      }
      lock.releaseLock();
      return responseJSON({ status: 'success', mode: 'REQUEST_LOGGED', message: '삭제 요청이 정상 접수되었습니다.' });
    }

    // 신규 등록 또는 수정
    if (currentMode === 'AUTO') {
      if (action === 'NEW') {
        mainSheet.appendRow([
          data.dateStr, data.seq, data.category, data.title,
          data.place || '', data.note || '', data.attendees || ''
        ]);
      } else if (action === 'EDIT') {
        var foundRow = findRowByDateAndSeq(mainSheet, data.dateStr, data.seq);
        if (foundRow > 0) {
          mainSheet.getRange(foundRow, 3).setValue(data.category);
          mainSheet.getRange(foundRow, 4).setValue(data.title);
          mainSheet.getRange(foundRow, 5).setValue(data.place || '');
          mainSheet.getRange(foundRow, 6).setValue(data.note || '');
          mainSheet.getRange(foundRow, 7).setValue(data.attendees || '');
        } else {
          mainSheet.appendRow([
            data.dateStr, data.seq, data.category, data.title,
            data.place || '', data.note || '', data.attendees || ''
          ]);
        }
      }
      lock.releaseLock();
      return responseJSON({ status: 'success', mode: 'AUTO_APPLIED', message: '데이터가 즉시 캘린더에 반영되었습니다.' });

    } else {
      if (requestSheet) {
        requestSheet.appendRow([
          new Date(), action === 'NEW' ? '신규' : '수정', data.dateStr, data.seq,
          data.category, data.title, data.place || '', data.note || '',
          data.attendees || '', '작성자: ' + authorName, '대기'
        ]);
      }
      lock.releaseLock();
      return responseJSON({ status: 'success', mode: 'REQUEST_LOGGED', message: '등록 요청이 정상 접수되었습니다. (관리자 승인 대기)' });
    }

  } catch (err) {
    if (lock) lock.releaseLock();
    return responseJSON({ status: 'error', message: err.toString() });
  }
}

function findRowByDateAndSeq(sheet, dateStr, seq) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var rowDate = String(data[i][0]).trim();
    var rowSeq = String(data[i][1]).trim();
    if (rowDate === String(dateStr).trim() && rowSeq === String(seq).trim()) {
      return i + 1;
    }
  }
  return -1;
}

function processPendingRequests() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mainSheet = ss.getSheetByName('이벤트DB');
  var requestSheet = ss.getSheetByName('이벤트요청');
  if (!mainSheet || !requestSheet) {
    SpreadsheetApp.getUi().alert('필수 탭이 없습니다.');
    return;
  }
  var reqData = requestSheet.getDataRange().getValues();
  var processedCount = 0;
  for (var i = 1; i < reqData.length; i++) {
    if (reqData[i][10] === '대기') {
      var reqType = reqData[i][1], dStr = reqData[i][2], dSeq = reqData[i][3];
      var dCat = reqData[i][4], dTitle = reqData[i][5], dPlace = reqData[i][6];
      var dNote = reqData[i][7], dAtt = reqData[i][8];
      var targetRow = findRowByDateAndSeq(mainSheet, dStr, dSeq);

      if (reqType === '삭제' && targetRow > 0) mainSheet.deleteRow(targetRow);
      else if (reqType === '수정' && targetRow > 0) {
        mainSheet.getRange(targetRow, 3).setValue(dCat);
        mainSheet.getRange(targetRow, 4).setValue(dTitle);
        mainSheet.getRange(targetRow, 5).setValue(dPlace);
        mainSheet.getRange(targetRow, 6).setValue(dNote);
        mainSheet.getRange(targetRow, 7).setValue(dAtt);
      } else if (reqType === '신규') {
        mainSheet.appendRow([dStr, dSeq, dCat, dTitle, dPlace, dNote, dAtt]);
      }
      requestSheet.getRange(i + 1, 11).setValue('완료');
      processedCount++;
    }
  }
  SpreadsheetApp.getUi().alert('총 ' + processedCount + '건 처리 완료.');
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
