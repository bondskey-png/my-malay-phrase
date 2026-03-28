async function displayTodaysPhrase() {
    try {
        // 1. あなたの専用URLに差し替えてください
        const apiUrl = 'https://script.google.com/macros/s/AKfycbzu59cPXeQO0y0PK8Kvk87BWIbw8Dcvmf_ipO7Nu0MOlW1hQCBsqN9VqelHIVDYbYl8/exec';
        
        const response = await fetch(apiUrl, { redirect: "follow" });
        const data = await response.json(); // ここで { phrases: [...], blogs: [...] } を受け取る

        const phrases = data.phrases || [];
        const blogs = data.blogs || [];

        // --- フレーズ表示ロジック ---
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const todayNum = parseInt(`${y}${m}${d}`); 

        // 今日以前のフレーズに絞って新しい順に並べる
        const filteredPhrases = phrases
            .filter(p => {
                if (!p.date) return false;
                const pDateNum = parseInt(p.date.replace(/-/g, '').substring(0, 8));
                return pDateNum <= todayNum;
            })
            .sort((a, b) => {
                const numA = parseInt(a.date.replace(/-/g, '').substring(0, 8));
                const numB = parseInt(b.date.replace(/-/g, '').substring(0, 8));
                return numB - numA;
            });

        if (filteredPhrases.length > 0) {
            // 今日の分（一番新しいもの）を表示
            updateDisplay(filteredPhrases[0]);
            displayArchive(filteredPhrases);
        }

        // --- ブログ表示ロジックの呼び出し ---
        displayBlogs(blogs);

    } catch (error) {
        console.error("Connection Error:", error);
        const phraseEl = document.getElementById('phrase');
        if (phraseEl) phraseEl.innerText = "データの読み込みに失敗しました。";
    }
}

// ブログをカード形式で表示する関数
function displayBlogs(blogs) {
    const container = document.getElementById('blog-container');
    if (!container) return;
    container.innerHTML = "";

    // ブログも新しい順に並べる
    blogs.sort((a, b) => {
        const numA = parseInt(a.date.replace(/-/g, '').substring(0, 8));
        const numB = parseInt(b.date.replace(/-/g, '').substring(0, 8));
        return numB - numA;
    });

    blogs.forEach(post => {
        const card = document.createElement('div');
        card.className = "blog-card";
        card.innerHTML = `
            ${post.image_url ? `<img src="${post.image_url}" class="blog-image" alt="blog image">` : ""}
            <div class="blog-content">
                <p class="blog-date">${post.date}</p>
                <p class="blog-title">${post.title}</p>
                <p class="blog-text">${post.content}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- 以下、既存の updateDisplay と displayArchive はそのままでOK ---

function updateDisplay(item) {
    if (!item) return;
    const setElText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    };
    setElText('category', `【${item.category || "日常"}】`);
    setElText('phrase', item.phrase || "");
    setElText('romaji', `《${item.romaji || ""}》`);
    setElText('meaning', item.meaning || "");
    setElText('nuance', item.nuance || "");
    setElText('tips', item.Tip || item.tips || "");

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