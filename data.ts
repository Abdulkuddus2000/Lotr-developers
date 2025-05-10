import fetch from "node-fetch";
import { Quote, Character } from "./interfaces";

// de quotes worden opgehaald uit deze 3 films
const movieIds = [
    "5cd95395de30eff6ebccde5d", // The Fellowship of the Ring
    "5cd95395de30eff6ebccde5c", // The Two Towers
    "5cd95395de30eff6ebccde5b"  // The Return of the King
];

export async function getQuotes(): Promise<Quote[]> {
    let quotes: Quote[] = [];
    try {
        const fetches = movieIds.map(id =>
            fetch(`https://the-one-api.dev/v2/movie/${id}/quote`, {
                method: "GET",
                headers: {
                    Accept: 'application/json',
                    Authorization: process.env.TOKEN ?? ""
                }
            })
        );

        const responses = await Promise.all(fetches); // alle API's tegelijk fetchen
        const dataArray = await Promise.all(responses.map(res => {
            if (!res.ok) throw new Error("Failed to fetch quotes-data");
            return res.json();
        }));

        for (const data of dataArray) {
            const typedData = data as { docs: any[] }; // Explicitly type 'data'
            const quotesFromData: Quote[] = typedData.docs.map((element: any): Quote => ({
                _id: element._id,
                dialog: element.dialog,
                movie_id: element.movie,
                character_id: element.character,
                id: element.id
            }));

            quotes.push(...quotesFromData);
        }
    } catch (error) {
        console.log("Error loading quotes:", error);
    }
    return quotes;
}

export async function getCharacter(): Promise<Character[]> {
    const characters: Character[] = [];
    try {
        const response = await fetch("https://the-one-api.dev/v2/character", {
        method: "GET",
        headers: {
        Accept: 'application/json',
        Authorization: process.env.TOKEN ?? ""
        }
    });

    if (!response.ok) throw new Error("Failed to fetch character-data");

    const data: any = await response.json();

    const charactersFromData: Character[] = data.docs.map((element: any): Character => ({
        _id: element._id,
        name: element.name,
        wikiUrl: element.wikiUrl,
        race: element.race,
        birth: element.birth,
        gender: element.gender,
        death: element.death,
        hair: element.hair,
        height: element.height,
        realm: element.realm,
        spouse: element.spouse,
        // total: data.total,
        // limit: data.limit,
        // offset: data.offset,
        // page: data.page,
        // pages: data.pages
    }));
        characters.push(...charactersFromData);
    }
    catch (error) {
        console.log(error);
    }

    return characters;
}
