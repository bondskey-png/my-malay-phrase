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

function updateDisplay(item) {
    // 1. 確実に存在する基本項目の書き込み
    document.getElementById('category').innerText = `【${item.category || "日常"}】`;
    document.getElementById('phrase').innerText = item.phrase || "";
    document.getElementById('romaji').innerText = `《${item.romaji || ""}》`;
    document.getElementById('meaning').innerText = item.meaning || "";
    
    // tips/Tipの書き込み（index.htmlに id="tips" があることを確認）
    const tipsElement = document.getElementById('tips');
    if (tipsElement) {
        tipsElement.innerText = item.Tip || item.tips || "";
    }

    // 2. 例文セクション（HTMLを組み立てて流し込む）
    const area = document.getElementById('examples-area');
    if (area) {
        area.innerHTML = '<h3>【例文】</h3>';
        
        // 例文1
        if(item.example1_title) {
            area.innerHTML += `
                <p class="example-title"><strong>${item.example1_title}</strong></p>
                <p><strong>A:</strong> ${item.example1_malay_A}<br>
                <small class="translation">＜${item.example1_jp_A}＞</small><br>
                <strong>B:</strong> ${item.example1_malay_B}<br>
                <small class="translation">＜${item.example1_jp_B}＞</small></p>`;
        }
        // 例文2
        if(item.example2_title) {
            area.innerHTML += `
                <p class="example-title"><strong>${item.example2_title}</strong></p>
                <p><strong>A:</strong> ${item.example2_malay_A}<br>
                <small class="translation">＜${item.example2_jp_A}＞</small><br>
                <strong>B:</strong> ${item.example2_malay_B}<br>
                <small class="translation">＜${item.example2_jp_B}＞</small></p>`;
        }
    }

    // 3. 音声ボタンの設定
    const speakBtn = document.getElementById('speak-btn');
    if (speakBtn) {
        speakBtn.onclick = () => {
            const uttr = new SpeechSynthesisUtterance(item.phrase);
            uttr.lang = 'ms-MY';
            window.speechSynthesis.speak(uttr);
        };
    }
}
function displayArchive(allPhrases) {
    const listElement = document.getElementById('phrase-list');
    if (!listElement) return;
    listElement.innerHTML = ""; // 既存リストをクリア
    
    allPhrases.forEach(item => {
        const li = document.createElement('li');
        li.className = "archive-item";
        // 日付表示の整形
        const displayDate = item.date ? item.date.split('T')[0] : "";
        
        li.innerHTML = `
            <span class="archive-date">${displayDate}</span>
            <strong class="archive-phrase">${item.phrase}</strong>
            <span class="archive-meaning">${item.meaning}</span>
        `;
        // クリックでメイン画面を更新
        li.onclick = () => {
            updateDisplay(item);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        listElement.appendChild(li);
    });
}