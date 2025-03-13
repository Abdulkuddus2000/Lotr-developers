import characters from "./characters.json" with { type: "json" };
import quotes from "./quotes.json" with { type: "json" };

// const characternames = [
//   "Frodo", "Gandalf", "Aragorn", "Legolas", "Gimli",
//   "Samwise", "Gollum", "Saruman", "Sauron", "Boromir",
//   "Merry", "Pippin", "Éowyn", "Théodon", "Faramir",
//   "Elrond", "Galadriel", "Bilbo", "Treebeard", "Nazgul"
// ];

// const main = document.querySelector("main");

// characternames.forEach(name => {
//     let section = document.createElement("section");
//     section.classList.add("character");

//     // Naam toevoegen
//     let title = document.createElement("h2");
//     title.textContent = name;
//     section.appendChild(title);

//     // Afbeelding toevoegen
//     let img = document.createElement("img");
//     img.src = `../../assets/images/character_${name}.jpeg`;
//     img.alt = `Afbeelding van ${name}`;
//     img.style.height = "200px";
//     img.style.alignItems = "center";
//     img.onerror = () => img.style.display = "none";
//     section.appendChild(img);

//     let numberOfQuotes = document.createElement('p');
//     numberOfQuotes.textContent = `Number of quotes: ${CountNumberOfQuotes(name)}`;
//     section.appendChild(numberOfQuotes);

//     // Voeg de section toe aan main
//     main.appendChild(section);
// });

// function CountNumberOfQuotes(characterName) {
//   let numberOfQuotes = 0;
//   const character = characters.docs.find(char => char.name === characterName);
//   if (character) {
//     for (let j = 0; j < quotes.docs.length; j++) {
//       if (character._id === quotes.docs[j].character) {
//         numberOfQuotes++;
//       }
//     }
//   }
//   return numberOfQuotes;
// }
//////////////////////////////////////////////////////////////////////
const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer 4ACz7_VG7ByzEpu7WLGv",
  },
};

fetch("https://the-one-api.dev/v2/character", options)
  .then((response) => response.json())
  .then((data) => {
    // Controleer of de data en docs array aanwezig zijn
    if (data && data.docs) {

      const characternames = [
        "Frodo", "Gandalf", "Aragorn", "Legolas", "Gimli",
        "Samwise", "Gollum", "Saruman", "Sauron", "Boromir",
        "Merry", "Pippin", "Éowyn", "Théodon", "Faramir",
        "Elrond", "Galadriel", "Bilbo", "Treebeard", "Nazgul"
      ];
      // Loop door de docs array en toon de naam van elk karakter
      data.docs.forEach((character) => {
        console.log(character.name);

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


      });
    }
  })
  .catch((error) => console.error("Error:", error));
