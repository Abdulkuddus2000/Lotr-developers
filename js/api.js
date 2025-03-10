import characters from "./characters.json" with { type: "json" };
import quotes from "./quotes.json" with { type: "json" };

const ul = document.querySelector('.charactersList');
characters.docs.forEach(character => {
  const li = document.createElement('li');
  li.textContent = character.name;
  li.style.color = "white";
  ul.appendChild(li);
});

