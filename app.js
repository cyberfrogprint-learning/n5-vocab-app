```javascript
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRtC4KU4o9VQ37slwlM4oNFgg76etlvM-z8kscz35G7GbEwV4VmSGqNiupxA0KHGWP0osMemE27_OOy/pub?output=csv";

let data = {};
let wrongWords = JSON.parse(localStorage.getItem("wrong")) || {};

let currentList = [];
let current;
let correct = 0;
let total = 0;

const card = document.getElementById("card");
const choices = document.getElementById("choices");
const answer = document.getElementById("answer");
const stats = document.getElementById("stats");
const unitSelect = document.getElementById("unitSelect");
const modeSelect = document.getElementById("mode");
const directionSelect = document.getElementById("direction");

// LOAD GOOGLE SHEET
async function loadSheet() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  const rows = text.split("\n").slice(1);

  rows.forEach(r => {
    const [unit, jp, vi] = r.split(",");

    if (!unit || !jp || !vi) return;

    if (!data[unit]) data[unit] = [];

    data[unit].push({
      jp: jp.trim(),
      vi: vi.trim()
    });
  });

  initApp();
}

// INIT APP
function initApp() {
  for (let u in data) {
    let opt = document.createElement("option");
    opt.value = u;
    opt.innerText = u;
    unitSelect.appendChild(opt);
  }

  loadUnit();
}

// LOAD UNIT
function loadUnit() {
  const u = unitSelect.value;
  currentList = data[u] || [];
  next();
}

unitSelect.onchange = loadUnit;
modeSelect.onchange = next;
directionSelect.onchange = next;

// NEXT QUESTION
function next() {
  choices.innerHTML = "";
  answer.value = "";

  if (modeSelect.value === "wrong") {
    currentList = Object.values(wrongWords);
  }

  if (currentList.length === 0) {
    card.innerText = "Không có từ";
    return;
  }

  current = currentList[Math.floor(Math.random() * currentList.length)];

  render();
}

// RENDER
function render() {
  const dir = directionSelect.value;

  card.innerText = dir === "jpvi" ? current.jp : current.vi;

  if (modeSelect.value === "mcq") {
    renderChoices();
  }
}

// MCQ
function renderChoices() {
  const dir = directionSelect.value;

  let correctAns = dir === "jpvi" ? current.vi : current.jp;

  let opts = [correctAns];

  while (opts.length < 4) {
    let r = currentList[Math.floor(Math.random() * currentList.length)];
    let val = dir === "jpvi" ? r.vi : r.jp;
    if (!opts.includes(val)) opts.push(val);
  }

  opts.sort(() => Math.random() - 0.5);

  opts.forEach(o => {
    let b = document.createElement("button");
    b.innerText = o;
    b.onclick = () => checkAnswer(o, correctAns);
    choices.appendChild(b);
  });
}

// CHECK MCQ
function checkAnswer(user, correctAns) {
  total++;

  if (user === correctAns) {
    correct++;
  } else {
    saveWrong(current);
    alert("Sai: " + correctAns);
  }

  updateStats();
  next();
}

// CHECK TYPING
function checkTyping() {
  const dir = directionSelect.value;
  let correctAns = dir === "jpvi" ? current.vi : current.jp;

  total++;

  if (answer.value.trim() === correctAns) {
    correct++;
  } else {
    saveWrong(current);
    alert("Sai: " + correctAns);
  }

  updateStats();
  next();
}

// SAVE WRONG
function saveWrong(word) {
  wrongWords[word.jp] = word;
  localStorage.setItem("wrong", JSON.stringify(wrongWords));
}

// STATS
function updateStats() {
  stats.innerText = `Đúng: ${correct}/${total}`;
}

// START
loadSheet();
```
