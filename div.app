<body>
<div class="app">

<h1>🇯🇵 N5 Trainer XS MAX</h1>

<select id="mode">
  <option value="flash">Flashcard</option>
  <option value="typing">Typing</option>
  <option value="quiz">Quiz</option>
  <option value="wrong">Sai</option>
</select>

<div class="card" id="card">
  <div id="front"></div>
  <div id="back" class="hidden"></div>
</div>

<div id="typingBox" class="hidden">
  <input id="answer" placeholder="Nhập nghĩa...">
  <button onclick="checkTyping()">Check</button>
</div>

<div id="choices"></div>

<h3 id="stats"></h3>

<button onclick="toggleDark()">🌙</button>

</div>
</body>
