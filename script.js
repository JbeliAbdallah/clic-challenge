const settings = document.getElementById("settings");
const gameSection = document.getElementById("gameSection");

const difficultySelect = document.getElementById("difficulty");
const speedSelect = document.getElementById("speed");
const durationSelect = document.getElementById("duration");

const startButton = document.getElementById("start");
const restartButton = document.getElementById("restart");
const backButton = document.getElementById("back");

const target = document.getElementById("target");
const game = document.getElementById("game");

const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const levelElement = document.getElementById("level");
const message = document.getElementById("message");

let score = 0;
let time = 30;
let interval = null;
let playing = false;
let targetSize = 35;
let moveDelay = 1000;
let lastMove = 0;

const difficulties = {
  easy: { size: 45, points: 1 },
  medium: { size: 35, points: 2 },
  hard: { size: 25, points: 3 },
};

const speeds = {
  slow: 1500,
  normal: 900,
  fast: 450,
};

function moveTarget() {
  if (!playing) return;

  const maxX = game.clientWidth - target.offsetWidth;
  const maxY = game.clientHeight - target.offsetHeight;

  target.style.left = Math.random() * Math.max(0, maxX) + "px";
  target.style.top = Math.random() * Math.max(0, maxY) + "px";

  lastMove = Date.now();
}

function startGame() {
  clearInterval(interval);

  score = 0;
  time = Number(durationSelect.value);
  playing = true;

  const difficulty = difficultySelect.value;

  targetSize = difficulties[difficulty].size;
  moveDelay = speeds[speedSelect.value];

  target.style.fontSize = targetSize + "px";

  scoreElement.textContent = score;
  timerElement.textContent = time;
  levelElement.textContent =
    difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  message.textContent = "Click the target!";
  settings.hidden = true;
  gameSection.hidden = false;
  restartButton.hidden = true;
  target.hidden = false;

  moveTarget();

  interval = setInterval(() => {
    time--;
    timerElement.textContent = time;

    if (time <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(interval);
  playing = false;

  target.hidden = true;
  restartButton.hidden = false;

  message.textContent = `🎉 Game Over! Your score: ${score}`;
}

target.addEventListener("click", () => {
  if (!playing) return;

  const difficulty = difficultySelect.value;
  score += difficulties[difficulty].points;

  scoreElement.textContent = score;

  // The target becomes smaller as your score increases.
  targetSize = Math.max(15, targetSize - 1);
  target.style.fontSize = targetSize + "px";

  moveTarget();
});

// Faster settings make the target move automatically.
setInterval(() => {
  if (playing && Date.now() - lastMove >= moveDelay) {
    moveTarget();
  }
}, 100);

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

backButton.addEventListener("click", () => {
  clearInterval(interval);
  playing = false;

  gameSection.hidden = true;
  settings.hidden = false;
});
