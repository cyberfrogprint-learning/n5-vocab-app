let vocab = [
  {jp:"水", vi:"nước"},
  {jp:"火", vi:"lửa"},
  {jp:"学校", vi:"trường học"},
  {jp:"先生", vi:"giáo viên"},
  {jp:"食べる", vi:"ăn"}
];

let current = 0;
let flipped = false;

let saved = JSON.parse(localStorage.getItem("saved")) || [];

function updateCard(){
  document.getElementById("front").innerText = vocab[current].jp;
  document.getElementById("back").innerText = vocab[current].vi;
  document.getElementById("card-inner").classList.remove("flipped");
  flipped = false;

  updateProgress();
}

function flipCard(){
  document.getElementById("card-inner").classList.toggle("flipped");
}

function nextWord(){
  current = (current + 1) % vocab.length;
  updateCard();
}

function prevWord(){
  current = (current - 1 + vocab.length) % vocab.length;
  updateCard();
}

function toggleSave(){
  let word = vocab[current].jp;
  if(saved.includes(word)){
    saved = saved.filter(w => w !== word);
    alert("Đã bỏ lưu");
  } else {
    saved.push(word);
    alert("Đã lưu");
  }
  localStorage.setItem("saved", JSON.stringify(saved));
}

function updateProgress(){
  let percent = ((current + 1) / vocab.length) * 100;
  document.getElementById("progress-bar").style.width = percent + "%";
}

// QUIZ
function loadQuiz(){
  let q = vocab[Math.floor(Math.random()*vocab.length)];
  let options = [q.vi];

  while(options.length < 4){
    let rand = vocab[Math.floor(Math.random()*vocab.length)].vi;
    if(!options.includes(rand)) options.push(rand);
  }

  options.sort(()=>Math.random()-0.5);

  let html = `<p>${q.jp} nghĩa là gì?</p>`;
  options.forEach(opt=>{
    html += `<button onclick="checkAnswer('${opt}','${q.vi}')">${opt}</button>`;
  });

  document.getElementById("quiz").innerHTML = html;
}

function checkAnswer(a, correct){
  if(a === correct){
    alert("✅ Đúng");
  } else {
    alert("❌ Sai");
  }
  loadQuiz();
}

// DARK MODE
function toggleDarkMode(){
  document.body.classList.toggle("dark");
}

// INIT
updateCard();
loadQuiz();
