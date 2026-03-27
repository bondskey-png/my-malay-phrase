async function displayTodaysPhrase() {
    try {
        // 1. 【重要】末尾が /exec で終わる「あなたの専用URL」に差し替えてください
        const apiUrl = 'https://script.google.com/macros/s/AKfycbzu59cPXeQO0y0PK8Kvk87BWIbw8Dcvmf_ipO7Nu0MOlW1hQCBsqN9VqelHIVDYbYl8/exec';
        
        const response = await fetch(apiUrl, {
            method: "GET",
            // mode: "cors" は不要（削除）にし、redirect のみ残すのがGASの定石です
            redirect: "follow" 
        });
        
        const malayPhrases = await response.json();

        // 2. 今日の日付を取得 (YYYY-MM-DD形式)
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0]; 

        // 3. データの中から今日の日付を探す
        const item = malayPhrases.find(p => p.date.startsWith(todayStr));

        if (item) {
            updateDisplay(item);      
            displayArchive(malayPhrases); 
        } else if (malayPhrases.length > 0) {
            // 4. データが見つからない場合は、最初の1件を表示する
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