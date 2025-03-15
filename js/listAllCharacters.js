import characters from "./characters.json" with { type: "json" };
import quotes from "./quotes.json" with { type: "json" };

const characternames = [
  "Frodo", "Gandalf", "Aragorn", "Legolas", "Gimli",
  "Samwise", "Gollum", "Saruman", "Sauron", "Boromir",
  "Merry", "Pippin", "Éowyn", "Théodon", "Faramir",
  "Elrond", "Galadriel", "Bilbo", "Treebeard", "Nazgul"
];

const main = document.querySelector("main");

characternames.forEach(name => {
  let section = document.createElement("section");

  let link = document.createElement("a");
  link.href = "../favoriteCharacter.html";

  let title = document.createElement("h3");
  title.textContent = name;

  let figure = document.createElement("figure");
  let img = document.createElement("img");
  img.src = `../../assets/images/character_${name}.jpeg`;
  img.alt = `Afbeelding van ${name}`;
  img.style.height = "200px";
  img.style.alignItems = "center";
  img.onerror = () => img.style.display = "none";
  figure.appendChild(img);

  let numberOfQuotes = document.createElement("p");
  numberOfQuotes.textContent = `Number of quotes: ${CountNumberOfQuotes(name)}`;

  link.appendChild(title);
  link.appendChild(figure);
  link.appendChild(numberOfQuotes);

  section.appendChild(link);
  
  main.appendChild(section);
});

function CountNumberOfQuotes(characterName) {
  let numberOfQuotes = 0;
  const character = characters.docs.find(char => char.name === characterName);
  if (character) {
    for (let j = 0; j < quotes.docs.length; j++) {
      if (character._id === quotes.docs[j].character) {
        numberOfQuotes++;
      }
    }
  }
  return numberOfQuotes;
}


// info tonen over character
console.log(characters);
console.log(quotes);

const character = characters.docs.find(char => char.name === "Gandalf");

if (character) {
  const gandalQuotes = quotes.docs.filter(quote => quote.character === character._id);
  
  const info = document.querySelector(".info");
  
  gandalQuotes.forEach(quote => {
    let p = document.createElement('p');
    p.textContent = quote.dialog;
    info.appendChild(p);
  });
}
