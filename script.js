async function displayTodaysPhrase() {
    try {
        const apiUrl = 'https://script.google.com';
        
        const response = await fetch(apiUrl, {
            method: "GET",
            redirect: "follow" 
        });
        
        const malayPhrases = await response.json();

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0]; 

        const item = malayPhrases.find(p => p.date.startsWith(todayStr));

        if (item) {
            updateDisplay(item);      
            displayArchive(malayPhrases); 
        } else if (malayPhrases.length > 0) {
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
    // 要素が存在するか確認してから書き込む補助関数
    const setElText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    };

    setElText('category', `【${item.category || "日常"}】`);
    setElText('phrase', item.phrase || "");
    setElText('romaji', `《${item.romaji || ""}》`);
    setElText('meaning', item.meaning || "");
    setElText('nuance', item.nuance || ""); // ニュアンス解説を反映
    setElText('tips', item.Tip || item.tips || ""); // 文化紹介を反映

    const area = document.getElementById('examples-area');
    if (area) {
        area.innerHTML = '<h3>【例文】</h3>';
        
        if(item.example1_title) {
            area.innerHTML += `
                <p class="example-title"><strong>${item.example1_title}</strong></p>
                <p><strong>A:</strong> ${item.example1_malay_A}<br>
                <small class="translation">＜${item.example1_jp_A}＞</small><br>
                <strong>B:</strong> ${item.example1_malay_B}<br>
                <small class="translation">＜${item.example1_jp_B}＞</small></p>`;
        }
        if(item.example2_title) {
            area.innerHTML += `
                <p class="example-title"><strong>${item.example2_title}</strong></p>
                <p><strong>A:</strong> ${item.example2_malay_A}<br>
                <small class="translation">＜${item.example2_jp_A}＞</small><br>
                <strong>B:</strong> ${item.example2_malay_B}<br>
                <small class="translation">＜${item.example2_jp_B}＞</small></p>`;
        }
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