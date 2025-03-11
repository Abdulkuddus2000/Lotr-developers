import characters from "./characters.json" with { type: "json" };
import quotes from "./quotes.json" with { type: "json" };

// const ul = document.querySelector('.charactersList');
// characters.docs.forEach(character => {
//   const li = document.createElement('li');
//   li.textContent = character.name;
//   li.style.color = "white";
//   ul.appendChild(li);
// });



// test met alle karakters en hun quotes
for (let i = 0; i < characters.docs.length; i++){
  let numberOfQuotes = 0; // teller aanmaken + resetten per nieuw karakter
  let characterName = characters.docs[i].name;

  // aantal quotes tellen voor elk karakter
  for (let j = 0; j < quotes.docs.length; j++){
    if (characters.docs[i]._id === quotes.docs[j].character) {
      numberOfQuotes++;
      console.log(`${characters.docs[i].name} zei: "${quotes.docs[j].dialog}"`)
    }
  }
  // toon het aantal quotes
  if (numberOfQuotes > 0) {
    console.log(`Aantal quotes van ${characterName}: ${numberOfQuotes}`);
  }
}

