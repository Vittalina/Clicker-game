const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nickname = form.elements.nickname.value;
  const name = form.elements.name.value;
  const email = form.elements.email.value;

  const userData = {
    nickname,
    name,
    email,
  };

  localStorage.setItem("nickname", nickname);
  localStorage.setItem("name", name);
  localStorage.setItem("email", email);

  window.location.href = "game.html";
});
