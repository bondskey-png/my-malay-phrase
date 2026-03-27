async function displayTodaysPhrase() {
    try {
        // 【重要】URLを必ず /exec 付きの専用URLに戻してください
        const apiUrl = 'https://script.google.com/macros/s/AKfycbzu59cPXeQO0y0PK8Kvk87BWIbw8Dcvmf_ipO7Nu0MOlW1hQCBsqN9VqelHIVDYbYl8/exec';
        
        const response = await fetch(apiUrl, {
            method: "GET",
            redirect: "follow" 
        });
        
        const malayPhrases = await response.json();

        const now = new Date();
        // 日本時間(GMT+9)に合わせて日付を取得
        const todayStr = now.toLocaleDateString('sv-SE'); // YYYY-MM-DD形式

        // データの中から今日の日付を探す（先頭一致）
        const item = malayPhrases.find(p => p.date && p.date.startsWith(todayStr));

        if (item) {
            updateDisplay(item);      
            displayArchive(malayPhrases); 
        } else if (malayPhrases.length > 0) {
            // 今日がなければ一番新しいものを表示
            updateDisplay(malayPhrases[0]);
            displayArchive(malayPhrases);
        }
    } catch (error) {
        console.error("Connection Error:", error);
        const phraseEl = document.getElementById('phrase');
        if (phraseEl) phraseEl.innerText = "データの読み込みに失敗しました。";
    }
}

function updateDisplay(item) {
    if (!item) return;

    // 要素が存在するか徹底的にチェックして書き込む
    const elCategory = document.getElementById('category');
    if (elCategory) elCategory.innerText = `【${item.category || "日常"}】`;

    const elPhrase = document.getElementById('phrase');
    if (elPhrase) elPhrase.innerText = item.phrase || "";

    const elRomaji = document.getElementById('romaji');
    if (elRomaji) elRomaji.innerText = `《${item.romaji || ""}》`;

    const elMeaning = document.getElementById('meaning');
    if (elMeaning) elMeaning.innerText = item.meaning || "";

    const elNuance = document.getElementById('nuance');
    if (elNuance) elNuance.innerText = item.nuance || "";

    const elTips = document.getElementById('tips');
    if (elTips) elTips.innerText = item.Tip || item.tips || "";

    const area = document.getElementById('examples-area');
    if (area) {
        area.innerHTML = '<h3>【例文】</h3>';
    
        const createExample = (title, m_a, j_a, m_b, j_b) => {
            if (!title) return "";
            return `
                <p class="example-title">${title}</p>
                <div class="chat-row">
                    <p><strong>A</strong> ${m_a}<br><small class="translation">＜${j_a}＞</small></p>
                    <p><strong>B</strong> ${m_b}<br><small class="translation">＜${j_b}＞</small></p>
                </div>`;
    };

    area.innerHTML += createExample(item.example1_title, item.example1_malay_A, item.example1_jp_A, item.example1_malay_B, item.example1_jp_B);
    area.innerHTML += createExample(item.example2_title, item.example2_malay_A, item.example2_jp_A, item.example2_malay_B, item.example2_jp_B);
    }

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
    listElement.innerHTML = "";
    
    allPhrases.forEach(item => {
        const li = document.createElement('li');
        li.className = "archive-item";
        const displayDate = item.date ? item.date.split('T')[0] : "";
        
        li.innerHTML = `
            <span class="archive-date">${displayDate}</span>
            <strong class="archive-phrase">${item.phrase}</strong>
            <span class="archive-meaning">${item.meaning}</span>
        `;
        li.onclick = () => {
            updateDisplay(item);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        listElement.appendChild(li);
    });
}

window.onload = displayTodaysPhrase;