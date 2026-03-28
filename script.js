// GASのdoGet関数をこのように修正
function doGet() {
  const ss = SpreadsheetApp.openById('1eGmjiAs4s1MXkCshg537MR1Vdjv232a5A10Jo9tlhUM');
  
  // フレーズ用シートとブログ用シートの両方を取得
  const phraseData = getSheetData(ss.getSheetByName('phrase')); // 元のシート名
  const blogData = getSheetData(ss.getSheetByName('blog'));
  
  const result = {
    phrases: phraseData,
    blogs: blogData
  };
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// データ変換用の補助関数
function getSheetData(sheet) {
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  return data.map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      let val = row[i];
      if (val instanceof Date) val = Utilities.formatDate(val, "GMT+8", "yyyy-MM-dd");
      obj[header] = val;
    });
    return obj;
  });
}