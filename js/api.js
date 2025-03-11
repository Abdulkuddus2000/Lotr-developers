import characters from "./characters.json" with { type: "json" };
import quotes from "./quotes.json" with { type: "json" };

// const ul = document.querySelector('.charactersList');
// characters.docs.forEach(character => {
//   const li = document.createElement('li');
//   li.textContent = character.name;
//   li.style.color = "white";
//   ul.appendChild(li);
// });

//  console.table(characters.docs);
//  console.table(quotes.docs);


for (const character of characters) {
  for (const quote of quotes) {
    if (character._id === quote._id) {
      console.log(character.docs.name, ": ", quote.docs.dialog)
    }
  }
}

