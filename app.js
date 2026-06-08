const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRtC4KU4o9VQ37slwlM4oNFgg76etlvM-z8kscz35G7GbEwV4VmSGqNiupxA0KHGWP0osMemE27_OOy/pub?output=csv";

let vocab = [];
let filtered = [];
let current = 0;
let showJP = true;

// 🔥 LOAD DATA (BẢN CHỐNG LỖI)
fetch(SHEET_URL)
  .then(res => res.text())
  .then(text => {
    const rows = text.split("\n").slice(1);

    vocab = rows.map(row => {
      const cols = row.split(",");

      return {
        jp: cols[0]?.replace(/"/g, "").trim(),
        vi: cols[1]?.replace(/"/g, "").trim(),
        lesson: cols[2]?.replace(/"/g, "").trim()
      };
    }).filter(v => v.jp && v.vi);

    filtered = [...vocab];

    setupLessonFilter();
    showWord();
  })
  .catch(err => {
    console.error("Lỗi load sheet:", err);
  });


// 🔹 FILTER LESSON
function setupLessonFilter() {
  const select = document.getElementById("lessonFilter");

  const lessons = [...new Set(vocab.map(v => v.lesson))];

  lessons.forEach(l => {
    const opt = document.createElement("option");
    opt.value = l;
    opt.textContent = "Bài " + l;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => {
    const val = select.value;

    filtered = val === "all"
      ? vocab
      : vocab.filter(v => v.lesson === val);

    current = 0;
    showWord();
  });
}


// 🔹 HIỂN THỊ
function showWord() {
  if (filtered.length === 0) {
    document.getElementById("front").textContent = "Không có dữ liệu";
    return;
  }

  const word = filtered[current];

  document.getElementById("front").textContent =
    showJP ? word.jp : word.vi;

  document.getElementById("back").textContent =
    showJP ? word.vi : word.jp;

  document.getElementById("back").classList.add("hidden");
}


// 🔹 LẬT THẺ
function flipCard() {
  document.getElementById("back").classList.toggle("hidden");
}


// 🔹 NEXT
function nextWord() {
  current = (current + 1) % filtered.length;
  showWord();
}


// 🔹 TRỘN
function shuffleWords() {
  filtered.sort(() => Math.random() - 0.5);
  current = 0;
  showWord();
}


// 🔹 ĐỔI CHẾ ĐỘ
function toggleMode() {
  showJP = !showJP;
  showWord();
}
