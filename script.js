async function displayTodaysPhrase() {
    try {
        // 1. あなたの確認済みURLをここに貼り付け
        const apiUrl = 'https://script.google.com';
        
        const response = await fetch(apiUrl);
        const malayPhrases = await response.json();

        // 2. 今日の日付を取得 (YYYY-MM-DD形式)
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0]; 

        // 3. データの中から今日の日付（先頭一致）を探す
        const item = malayPhrases.find(p => p.date.startsWith(todayStr));

        if (item) {
            updateDisplay(item);      
            displayArchive(malayPhrases); 
        } else {
            // テスト用：データが見つからない場合は、最新のデータを表示する
            updateDisplay(malayPhrases[0]);
            displayArchive(malayPhrases);
        }
    } catch (error) {
        console.error("Connection Error:", error);
        document.getElementById('phrase').innerText = "データの読み込みに失敗しました。";
    }
}

// ページ読み込み時に実行
window.onload = displayTodaysPhrase;