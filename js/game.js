const clicksDisplay = document.getElementById("clicks-display");
const levelDisplay = document.getElementById("level-display");
const targetNumber = document.getElementById("target-number");
const messageDisplay = document.getElementById("message-display");
const clickBtn = document.getElementById("clickBtn");
const resetBtn = document.getElementById("resetBtn");
const scoreDisplay = document.getElementById("score");
const pokemonDisplay = document.getElementById("pokemon-display");

let clicks = 0;
let target = 10;
let level = 0;
let pokemon = null;
let score = 0;

resetBtn.disabled = true;

const nickname = localStorage.getItem("nickname");

const nicknameElement = document.getElementById("nickname-display");
nicknameElement.textContent = nickname;

function getRandomPokemon(callback) {
  if (level !== 5) {
    fetch("https://pokeapi.co/api/v2/pokemon")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch pokemon data.");
        }
        return response.json();
      })
      .then((data) => {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const randomPokemonUrl = data.results[randomIndex].url;
        return fetch(randomPokemonUrl);
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch pokemon data.");
        }
        return response.json();
      })
      .then((data) => {
        const pokemonImage = document.getElementById("pokemon-image");
        pokemonImage.src = data.sprites.other["official-artwork"].front_default;
        callback(data);
      })
      .catch((error) => {
        console.error(error);
        showError("Failed to fetch pokemon data.");
        clearError();
      });
  }
}

getRandomPokemon((pokemon) => {
  console.log("Encountered a wild pokemon!", pokemon);
  pokemon = pokemon;
});

function updateBackground() {
  const container = document.querySelector(".container");
  switch (level) {
    case 0:
      container.style.backgroundColor = "#e0e0e0";
      break;
    case 1:
      container.style.backgroundColor = "#ceead9";
      break;
    case 2:
      container.style.backgroundColor = "#e2e2a5";
      break;
    case 3:
      container.style.backgroundColor = "#e2bba7";
      break;
    case 4:
      container.style.backgroundColor = "#df99df";
      break;
    case 5:
      container.style.backgroundColor = "#54b2d1";
      break;
    default:
      container.style.background = "white";
  }
}

function update() {
  clicksDisplay.innerText = clicks;
  levelDisplay.innerText = `Level ${level}`;
  targetNumber.innerText = target;
  scoreDisplay.innerText = `${score} clicks`;
  if (pokemon) {
    pokemonDisplay.innerHTML = pokemon
      ? `<img id="pokemon-image" src="${pokemon.sprites.front_default}" alt="Pokemon" />`
      : "";
  }
  if (level === 5) {
    clickBtn.disabled = true;
    resetBtn.disabled = false;
    messageDisplay.innerText = "You win!";
    updateBackground();
  } else {
    clickBtn.disabled = false;
    resetBtn.disabled = true;
  }
}

clickBtn.addEventListener("click", function () {
  if (level <= 5) {
    clicks += 1;
    score += 1;
    if (clicks >= target) {
      level += 1;
      target += 10;
      clicks = 0;
      Notiflix.Notify.success(
        `Congratulations! You've reached Level ${level}!`
      );
      if (level === 5) {
        target = 0;
        Notiflix.Notify.success("You've reached the final level!");
      }
      getRandomPokemon((pokemon) => {
        console.log("Encountered a wild pokemon!", pokemon);
        pokemon = pokemon;
        updateBackground();
        update();
      });
      setTimeout(() => {
        messageDisplay.innerText = "";
        pokemon = null;
        update();
      }, 2000);
    }
    update();
  } else {
    clickBtn.disabled = false;
  }
});

resetBtn.addEventListener("click", function () {
  clicks = 0;
  target = 10;
  level = 0;
  pokemon = null;
  score = 0;
  getRandomPokemon((pokemon) => {
    console.log("Encountered a wild pokemon!", pokemon);
    pokemon = pokemon;
    messageDisplay.innerText = "";
    updateBackground();
    update();
  });
});

function showError(message) {
  const errorDisplay = document.getElementById("error-display");
  errorDisplay.innerText = message;
}

function clearError() {
  const errorDisplay = document.getElementById("error-display");
  errorDisplay.innerText = "";
}
