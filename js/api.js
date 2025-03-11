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
  section.style.padding = "10px";
  section.style.marginBottom = "10px";
  section.style.borderRadius = "5px";

  // de afbeelding van het karakter
  let figure = document.createElement("figure");
  let img = document.createElement("img");
  img.src = characters.docs[i].wikiUrl ? `https://lotr-wiki-images.com/${characters.docs[i]._id}.jpg` :
    "placeholder.jpg";
  img.alt = `Afbeelding van ${characterName}`;
  img.style.width = "150px";
  img.style.height = "auto";

  figure.appendChild(img);
  section.appendChild(figure);

  // h3 aanmaken voor naam van karakter
  let titleForName = document.createElement("h3");
  titleForName.textContent = characterName;
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

