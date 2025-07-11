/* --------- ELEMENT REFERENCES --------- */
const boardEl  = document.getElementById("board");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const newBtn   = document.getElementById("newGame");

/* --------- GAME STATE --------- */
const combos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6]             // diag
];
let board, turn, score;

/* --------- INITIALISATION --------- */
function init(fullMatch = true) {
  board = Array(9).fill("");
  turn  = "X";
  if (fullMatch) score = { X: 0, O: 0 };

  boardEl.innerHTML = "";
  board.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.className = "cell";
    btn.dataset.i = i;
    btn.addEventListener("click", handleMove, { once: true });
    boardEl.appendChild(btn);
  });
  updateStatus();
}
document.addEventListener("DOMContentLoaded", () => init(true));

/* --------- GAME LOGIC --------- */
function handleMove(e) {
  const idx = +e.target.dataset.i;
  board[idx] = turn;
  e.target.innerHTML =
    `<span class="symbol ${turn.toLowerCase()}">${turn === "X" ? "×" : "○"}</span>`;

  if (winnerFound()) {
    score[turn]++;
    highlightWin();
    statusEl.innerHTML =
      `<strong>${turn}</strong> wins! 🎉  —  X:${score.X}&nbsp;|&nbsp;O:${score.O}`;
    freezeBoard();
  } else if (board.every(Boolean)) {
    statusEl.innerHTML = `Draw! 🤝  —  X:${score.X}&nbsp;|&nbsp;O:${score.O}`;
  } else {
    turn = turn === "X" ? "O" : "X";
    updateStatus();
  }
}

function winnerFound() {
  return combos.some(c => c.every(i => board[i] === turn));
}

function highlightWin() {
  combos.forEach(c => {
    if (c.every(i => board[i] === turn))
      c.forEach(i => boardEl.children[i].classList.add("win"));
  });
}

function freezeBoard() {
  [...boardEl.children].forEach(cell =>
    cell.replaceWith(cell.cloneNode(true))
  );
}

function updateStatus() {
  statusEl.innerHTML =
    `${turn}'s turn  —  X:${score.X}&nbsp;|&nbsp;O:${score.O}`;
}

/* --------- BUTTONS --------- */
resetBtn.onclick  = () => init(false); // keep score
newBtn.onclick    = () => init(true);  // reset score
