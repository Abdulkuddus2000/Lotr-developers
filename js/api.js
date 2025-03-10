// setTimeout(() => {
//   fetch("https://the-one-api.dev/v2/quote", {
//     method: "GET",
//     headers: { Authorization: `Bearer 4ACz7_VG7ByzEpu7WLGv` },
//   })
//     .then((response) => response.json())
//     .then(async (data) => {
//       console.log(data);
//       const quotes = data.docs; // quotes zitten in een array 'docs'

//       // karakterdata ophalen per quote
//       const characterPromises = quotes.map(
//         (quote, index) =>
//           new Promise((resolve) => {
//             setTimeout(() => {
//               fetch(`https://the-one-api.dev/v2/character/${quote.character}`, {
//                 method: "GET",
//                 headers: {
//                   Authorization: `Bearer 4ACz7_VG7ByzEpu7WLGv`,
//                 },
//               })
//                 .then((res) => res.json())
//                 .then(resolve)
//                 .catch((error) => {
//                   console.error(
//                     `Fout bij ophalen van karakter ${quote.character}: `,
//                     error
//                   );
//                   resolve({ docs: [{ name: "Onbekend" }] }); // nu zal niet heel het script crashen.
//                 });
//             }, index * 5000);
//           })
//       );

//       const characters = await Promise.all(characterPromises);

//       // combining quotes with their character:
//       quotes.forEach((quote, index) => {
//         const characterName = character[index]?.docs[0]?.name || "Onbekend";
//         console.log(characterName, ":", quote.dialog);
//       });
//     })
//     .catch((error) => console.error("Fout bij ophalen: ", error));
// }, 1000);

// Helper functie om vertraging toe te voegen
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

setTimeout(async () => {
  try {
    const response = await fetch("https://the-one-api.dev/v2/quote", {
      method: "GET",
      headers: { Authorization: `Bearer 4ACz7_VG7ByzEpu7WLGv` },
    });

    const data = await response.json();

    // Controleer of `data.docs` bestaat
    if (!data.docs) {
      throw new Error("API-response bevat geen 'docs' veld");
    }

    const quotes = data.docs; // Quotes zitten in een array 'docs'

    const characters = [];

    // In plaats van `.map()`, gebruiken we een `for...of`-loop met vertraging
    for (const [index, quote] of quotes.entries()) {
      await delay(1000); // Wacht 1 seconde per API-aanroep

      try {
        const charResponse = await fetch(
          `https://the-one-api.dev/v2/character/${quote.character}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer 4ACz7_VG7ByzEpu7WLGv` },
          }
        );

        const charData = await charResponse.json();

        // Controleer of `charData.docs` bestaat
        const characterName = charData.docs?.[0]?.name || "Onbekend";

        characters.push({ characterName, dialog: quote.dialog });
      } catch (charError) {
        console.error(
          `Fout bij ophalen van karakter ${quote.character}:`,
          charError
        );
        characters.push({ characterName: "Onbekend", dialog: quote.dialog });
      }
    }

    // Resultaten tonen
    characters.forEach(({ characterName, dialog }) => {
      console.log(`${characterName}: "${dialog}"`);
    });
  } catch (error) {
    console.error("Fout bij ophalen van quotes: ", error);
  }
}, 1000);
