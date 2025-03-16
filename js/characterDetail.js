import charactersData from "./characters.json" with { type: "json" };
import quotesData from "./quotes.json" with { type: "json" };

const character = charactersData.docs.find(char => char.name === "Gandalf");
const gandalfQuotes = quotesData.docs.filter(quote => quote.character === character._id);

// info over het karakter
const info = document.querySelector(".quotes");


// quotes van het karakter

gandalfQuotes.forEach(quote => {
  let quoteSection = document.createElement('section');
  let q = document.createElement('q');
  let em = document.createElement('em');

  q.textContent = `"${quote.dialog}"`;

  em.appendChild(q)
  quoteSection.appendChild(em);
  info.appendChild(quoteSection);
});
