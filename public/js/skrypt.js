/* globals axios: false */
// https://github.com/axios/axios

window.addEventListener("DOMContentLoaded", () => {
  newGame();
});

function guess() {
  var guess = document.getElementById("guess").value;

  var newGuess = document.createElement("div");
  var newGuessLeft = document.createElement("div");
  var newGuessRight = document.createElement("div");
  var hLeft = document.createElement("h2");
  var hRight = document.createElement("h3");

  var blackScore = parseInt(document.getElementById("black-score").innerHTML);
  var whiteScore = parseInt(document.getElementById("white-score").innerHTML);
  var remaining = parseInt(document.getElementById("unrated").innerHTML);
  var movesleft = parseInt(document.getElementById("tries-left").innerHTML);

  axios
    .patch("/game", {
      guess: guess,
      movesleft: movesleft,
      black: blackScore,
      white: whiteScore,
    })
    .then((resp) => {
      let black = resp.data.black;
      let white = resp.data.white;
      hRight.innerHTML = "Czarne: " + black + " &emsp; Białe: " + white;
      document.getElementById("black-score").innerHTML = blackScore + black;
      document.getElementById("white-score").innerHTML = whiteScore + white;
      remaining = remaining - (black + white);
      document.getElementById("unrated").innerHTML = remaining;
      if (remaining == 0) {
        document.getElementById("guess").style.visibility = "hidden";
        document.getElementById("guess-btn").style.visibility = "hidden";
      }
    });

  hLeft.innerHTML = "Guess: " + guess;
  newGuess.className = "log-item";
  newGuessRight.appendChild(hRight);
  newGuessLeft.appendChild(hLeft);
  newGuess.appendChild(newGuessLeft);
  newGuess.appendChild(newGuessRight);

  document.getElementById("log").prepend(newGuess);

  var triesLeft = document.getElementById("tries-left").innerHTML;

  if (!isNaN(triesLeft)) {
    document.getElementById("tries-left").innerHTML = triesLeft - 1;
    if (triesLeft - 1 == 0) {
      document.getElementById("guess").style.visibility = "hidden";
      document.getElementById("guess-btn").style.visibility = "hidden";
    }
  }
}

function newGame() {
  document.getElementById("log").innerHTML = "";
  var size = parseInt(document.getElementById("size").value);
  var dim = parseInt(document.getElementById("dim").value);
  var max = parseInt(document.getElementById("max").value);

  var maxguess = dim;
  for (let i = 1; i < size; i++) {
    maxguess *= 10;
    maxguess += dim;
  }

  document.getElementById("guess").setAttribute("max", maxguess);
  document.getElementById("guess").style.visibility = "visible";
  document.getElementById("guess-btn").style.visibility = "visible";

  axios
    .post("/game", {
      size: size,
      dim: dim,
      max: max,
    })
    .then((resp) => {
      console.log("Odpowiedź serwera na POST /game:");
      console.dir(resp.data);
    });
  if (max == 0) {
    max = "&infin;";
  }
  document.getElementById("black-score").innerHTML = 0;
  document.getElementById("white-score").innerHTML = 0;
  document.getElementById("unrated").innerHTML = size;
  document.getElementById("tries-left").innerHTML = max;
}
