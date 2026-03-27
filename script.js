// 本番は fetch('GASのURL') を使用
const dummyData = [
  {
    date: new Date().toISOString().split('T')[0], // 今日の日付
    phrase: "di laluan bas",
    romaji: "ディ ラルアン バス",
    meaning: "バスの路線上にある",
    category: "旅行者向け",
    nuance: "目的地がバスで行ける経路にあるかを確認する際に使います。",
    examples: [
      { title: "1. 観光での確認", dialogue: [{speaker:"A", malay:"Adakah muzium ini di laluan bas?", jp:"博物館はバスの路線上にありますか？"}] }
    ],
    tips: "マレーシアのバスは時間にルーズなこともあるので余裕を持って！"
  }
];

function updateDisplay(item) {
    document.getElementById('category').innerText = `【${item.category}】`;
    document.getElementById('phrase').innerText = item.phrase;
    document.getElementById('romaji').innerText = `《${item.romaji}》`;
    document.getElementById('meaning').innerText = item.meaning;
    document.getElementById('nuance').innerText = item.nuance;
    document.getElementById('tips').innerText = item.tips;

    const area = document.getElementById('examples-area');
    area.innerHTML = '<h3>【例文】</h3>';
    item.examples.forEach(ex => {
        area.innerHTML += `<p><strong>${ex.title}</strong></p>`;
        ex.dialogue.forEach(line => {
            area.innerHTML += `<p><strong>${line.speaker}:</strong> ${line.malay}<br><small>＜${line.jp}＞</small></p>`;
        });
    });
}

// 音声再生
document.getElementById('speak-btn').onclick = () => {
    const uttr = new SpeechSynthesisUtterance(document.getElementById('phrase').innerText);
    uttr.lang = 'ms-MY';
    window.speechSynthesis.speak(uttr);
};

// 初期実行
window.onload = () => updateDisplay(dummyData[0]);