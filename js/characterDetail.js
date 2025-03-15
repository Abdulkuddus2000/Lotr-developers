import characters from "./characters.json" with { type: "json" };
import quotes from "./quotes.json" with { type: "json" };


// info tonen over character

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
