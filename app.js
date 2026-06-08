const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRtC4KU4o9VQ37slwlM4oNFgg76etlvM-z8kscz35G7GbEwV4VmSGqNiupxA0KHGWP0osMemE27_OOy/pub?output=csv";

let vocab = [];
let current = 0;
let correct = 0;
let wrong = 0;

let wrongList = JSON.parse(localStorage.getItem("wrong")) || [];

fetch(SHEET_URL)
.then(r=>r.text())
.then(t=>{
  vocab = t.split("\n").slice(1).map(r=>{
    let c=r.split(",");
    return {jp:c[0],vi:c[1]};
  }).filter(v=>v.jp);

  nextWord();
});

function nextWord(){
  let mode = modeSelect();

  let list = vocab;
  if(mode==="wrong" && wrongList.length>0){
    list = vocab.filter(v=>wrongList.includes(v.jp));
  }

  current = Math.floor(Math.random()*list.length);
  show(list[current]);
}

function show(w){
  resetUI();

  front.textContent = w.jp;
  back.textContent = w.vi;

  if(modeSelect()==="typing"){
    typingBox.classList.remove("hidden");
  }

  if(modeSelect()==="quiz"){
    generateQuiz(w);
  }
}

function resetUI(){
  back.classList.add("hidden");
  typingBox.classList.add("hidden");
  choices.innerHTML="";
}

card.onclick=()=> back.classList.toggle("hidden");

function checkTyping(){
  let val = answer.value.trim().toLowerCase();
  let correctAns = back.textContent.toLowerCase();

  if(val===correctAns){
    correct++;
    card.classList.add("correct");
  }else{
    wrong++;
    wrongList.push(front.textContent);
    localStorage.setItem("wrong", JSON.stringify(wrongList));
    card.classList.add("wrong");
  }

  updateStats();
  setTimeout(nextWord,800);
}

function generateQuiz(w){
  let arr=[w.vi];

  while(arr.length<4){
    let r=vocab[Math.floor(Math.random()*vocab.length)].vi;
    if(!arr.includes(r)) arr.push(r);
  }

  arr.sort(()=>Math.random()-0.5);

  arr.forEach(a=>{
    let btn=document.createElement("button");
    btn.textContent=a;

    btn.onclick=()=>{
      if(a===w.vi){
        correct++;
        btn.classList.add("correct");
      }else{
        wrong++;
        wrongList.push(w.jp);
        btn.classList.add("wrong");
      }
      updateStats();
      setTimeout(nextWord,800);
    }

    choices.appendChild(btn);
  });
}

function updateStats(){
  stats.textContent = `✅ ${correct} | ❌ ${wrong}`;
}

function modeSelect(){
  return document.getElementById("mode").value;
}

function toggleDark(){
  document.body.style.background =
    document.body.style.background === "black" ? "#f7f3ee" : "black";
}
