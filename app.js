// 🔥 DÁN LINK CSV Ở ĐÂY
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRtC4KU4o9VQ37slwlM4oNFgg76etlvM-z8kscz35G7GbEwV4VmSGqNiupxA0KHGWP0osMemE27_OOy/pub?output=csv";

let vocab = [];
let current = 0;
let showJP = true;
let filtered = [];

// Load data
fetch(SHEET_URL)
  .then(res => res.text())
  .then(text => {
    let rows = text.split("\n");

    vocab = rows
      .slice(1)
      .filter(r => r.trim() !== "")
      .map(row => {
        let cols = row.split(",");
        return {
          jp: cols[0]?.trim(),
          vi: cols[1]?.trim(),
          lesson: cols[2]?.trim()
        };
      });

    setupLessons();
    filtered = vocab;
    showWord();
  });

// Setup lesson filter
function setupLessons() {
  const lessons = [...new Set(vocab.map(v => v.lesson))];
  const select = document.getElementById("lessonFilter");

  lessons.forEach(l => {
    let opt = document.createElement("option");
    opt.value = l;
    opt.textContent = "Bài " + l;
    select.appendChild(opt);
  });

  select.onchange = () => {
    let val = select.value;
    filtered = val === "all"
      ? vocab
      : vocab.filter(v => v.lesson === val);

    current = 0;
    showWord();
  };
}

// Show word
function showWord() {
  if (filtered.length === 0) return;

  let word = filtered[current];

  document.getElementById("front").textContent =
    showJP ? word.jp : word.vi;

  document.getElementById("back").textContent =
    showJP ? word.vi : word.jp;

  document.getElementById("back").classList.add("hidden");
}

// Flip card
function flipCard() {
  document.getElementById("back").classList.toggle("hidden");
}

// Next
function nextWord() {
  current = (current + 1) % filtered.length;
  showWord();
}

// Shuffle
function shuffleWords() {
  filtered.sort(() => Math.random() - 0.5);
  current = 0;
  showWord();
}

// Mode
function toggleMode() {
  showJP = !showJP;
  showWord();
}
