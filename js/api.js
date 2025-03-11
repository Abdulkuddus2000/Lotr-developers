import characters from "./characters.json" with { type: "json" };
import quotes from "./quotes.json" with { type: "json" };

let main = document.querySelector('main');


// test met alle karakters en hun quotes
for (let i = 0; i < characters.docs.length; i++){
  let numberOfQuotes = 0; // teller aanmaken + resetten per nieuw karakter
  let characterName = characters.docs[i].name;

  // section aanmaken per karakter
  let section = document.createElement('section');
  section.style.backgroundColor = "grey";

  // h3 aanmaken voor naam van karakter
  let titleForName = document.createElement('h3');
  titleForName.textContent = characterName;
  
  // h3 toevoegen aan sectie
  section.appendChild(titleForName);


  // aantal quotes tellen voor elk karakter
  for (let j = 0; j < quotes.docs.length; j++){
    if (characters.docs[i]._id === quotes.docs[j].character) {
      numberOfQuotes++;
      console.log(`${characters.docs[i].name} zei: "${quotes.docs[j].dialog}"`)
    }
  }

  // toon het aantal quotes
  if (numberOfQuotes > 0) {
    // p aanmaken
    let textForNumberOfQuotes = document.createElement('p');
    textForNumberOfQuotes.textContent = `Aantal quotes voor ${characterName}: ${numberOfQuotes}`;
    section.appendChild(textForNumberOfQuotes);
  }

  main.appendChild(section);
}

