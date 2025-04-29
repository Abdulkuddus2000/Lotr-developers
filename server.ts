import { error } from "console";
import e from "express";
import express from "express";
const app = express();
app.set("port", 3000);
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Simuleer een LOTR API call
async function getLotrCharacterData(characterId: string) {
  try {
    const token = '4ACz7_VG7ByzEpu7WLGv';

    const [characterRes, quotesRes] = await Promise.all([
      fetch(`https://the-one-api.dev/v2/character/${characterId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }),

      fetch(`https://the-one-api.dev/v2/character/${characterId}/quote`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    ]);


    if (!characterRes.ok || !quotesRes.ok) {
      throw new Error(`API call failed with status: ${characterRes.status}`);
    }

    const characterData = await characterRes.json();
    const quotesData = await quotesRes.json();

    console.log(characterData);
    console.log(quotesData);

    return {
      name: characterData.docs[0]?.name,
      imageUrl: "", // The One API geeft geen image URLs standaard mee
      quotes: quotesData.docs.map((doc: any) => doc.dialog)
    };
  } catch (e: unknown) {
    if (e instanceof Error)
      console.error("Error: ", e);
  }
}

// Route voor specifieke karakters
app.get('/character/:id', async (req, res) => {
  const characterId: string = req.params.id;

  try {
    const data = await getLotrCharacterData('1');
    console.log(data);

    res.render('allCharacters', {
      characters: data // Stuur slechts één karakter naar de view
    });
  } catch (error) {
    res.status(500).send('Fout bij ophalen van karaktergegevens.');
  }
});

// Route voor alle karakters
app.get('/allCharacters', async (req, res) => {
  try {
    const data = await getLotrCharacterData('1');  // Haal hier meerdere karakters op via je API
    res.render('allCharacters', {
      characters: [data]  // Hier stuur je meerdere karakters
    });
  } catch (error) {
    res.status(500).send('Fout bij ophalen van karakters.');
  }
});

app.listen(app.get("port"), () => {
  console.log(`Server draait op http://localhost:${app.get("port")}`);
});
