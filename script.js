async function displayTodaysPhrase() {
    try {
        const apiUrl = 'https://script.google.com/macros/s/AKfycbzu59cPXeQO0y0PK8Kvk87BWIbw8Dcvmf_ipO7Nu0MOlW1hQCBsqN9VqelHIVDYbYl8/exec';
        
        const response = await fetch(apiUrl, {
            method: "GET",
            redirect: "follow" 
        });
        
        const malayPhrases = await response.json();

        // 1. 今日の日付を「20260328」という純粋な数字にする
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const todayNum = parseInt(`${y}${m}${d}`); 

        // 2. データを「数字」に変換して、今日以前のものだけに絞り込む
        // 2026-03-29 -> 20260329 に変換して比較
        const filteredPhrases = malayPhrases.filter(p => {
            if (!p.date) return false;
            const pDateNum = parseInt(p.date.replace(/-/g, '').substring(0, 8));
            return pDateNum <= todayNum; 
        });

        // 3. 日付の「新しい順」に並び替える
        filteredPhrases.sort((a, b) => {
            const numA = parseInt(a.date.replace(/-/g, '').substring(0, 8));
            const numB = parseInt(b.date.replace(/-/g, '').substring(0, 8));
            return numB - numA;
        });

        // 4. 表示処理
        if (filteredPhrases.length > 0) {
            updateDisplay(filteredPhrases[0]);
            displayArchive(filteredPhrases); 
        } else {
            document.getElementById('phrase').innerText = "本日のフレーズは準備中です。";
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
    
    // 今日の日付を取得 (比較用)
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const todayStr = `${y}-${m}-${d}`;

    // 1. 今日以前（今日を含む）のデータだけに絞り込む
    // 2. 日付の新しい順（降順）に並び替える
    const filteredPhrases = allPhrases
        .filter(item => item.date && item.date <= todayStr) 
        .sort((a, b) => (a.date < b.date ? 1 : -1));

    filteredPhrases.forEach(item => {
        const li = document.createElement('li');
        li.className = "archive-item";
        
        // 表示用の日付整形
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