const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRtC4KU4o9VQ37slwlM4oNFgg76etlvM-z8kscz35G7GbEwV4VmSGqNiupxA0KHGWP0osMemE27_OOy/pub?output=csv";

let data = [];
let wrongWords = JSON.parse(localStorage.getItem("wrong")) || {};

let current;
let correct = 0;
let total = 0;

const front = document.getElementById("front");
const back = document.getElementById("back");
const answer = document.getElementById("answer");
const stats = document.getElementById("stats");
const mode = document.getElementById("mode");
const choices = document.getElementById("choices");
const typingBox = document.getElementById("typingBox");
const card = document.getElementById("card");

// LOAD DATA
async function loadSheet() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  const rows = text.split("\n").slice(1);

  rows.forEach(r => {
    const [unit, jp, vi] = r.split(",");
    if (!jp || !vi) return;

    data.push({
      jp: jp.trim(),
      vi: vi.trim()
    });
  });

  next();
}

// NEXT
function next() {
  choices.innerHTML = "";
  answer.value = "";
  back.classList.add("hidden");

  let list = data;

  if (mode.value === "wrong") {
    list = Object.values(wrongWords);
  }

  if (list.length === 0) {
    front.innerText = "Không có dữ liệu";
    return;
  }

  current = list[Math.floor(Math.random() * list.length)];

  front.innerText = current.jp;
  back.innerText = current.vi;

  // typing
  if (mode.value === "typing") {
    typingBox.classList.remove("hidden");
  } else {
    typingBox.classList.add("hidden");
  }

  // quiz
  if (mode.value === "quiz") {
    renderChoices(list);
  }
}

// FLIP CARD
card.onclick = () => {
  if (mode.value === "flash") {
    back.classList.toggle("hidden");
  }
};

// QUIZ
function renderChoices(list) {
  let opts = [current.vi];

  while (opts.length < 4) {
    let r = list[Math.floor(Math.random() * list.length)].vi;
    if (!opts.includes(r)) opts.push(r);
  }

  opts.sort(() => Math.random() - 0.5);

  opts.forEach(o => {
    let b = document.createElement("button");
    b.innerText = o;
    b.onclick = () => checkQuiz(o);
    choices.appendChild(b);
  });
}

function checkQuiz(ans) {
  total++;

  if (ans === current.vi) {
    correct++;
  } else {
    saveWrong(current);
    alert("Sai: " + current.vi);
  }

  updateStats();
  next();
}

// TYPING
function checkTyping() {
  total++;

  if (answer.value.trim() === current.vi) {
    correct++;
  } else {
    saveWrong(current);
    alert("Sai: " + current.vi);
  }

  updateStats();
  next();
}

// SAVE WRONG
function saveWrong(w) {
  wrongWords[w.jp] = w;
  localStorage.setItem("wrong", JSON.stringify(wrongWords));
}

// STATS
function updateStats() {
  stats.innerText = `Đúng: ${correct}/${total}`;
}

// DARK MODE
function toggleDark() {
  document.body.classList.toggle("dark");
}

// CHANGE MODE
mode.onchange = next;

// START
loadSheet();
