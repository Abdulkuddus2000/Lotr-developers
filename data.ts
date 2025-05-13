import fetch from "node-fetch";
import { Quote, Character } from "./interfaces";

export let quotes: Quote[] = [];

// De quotes worden opgehaald uit deze 3 films
const movieIds = [
    "5cd95395de30eff6ebccde5d", // The Fellowship of the Ring
    "5cd95395de30eff6ebccde5c", // The Two Towers
    "5cd95395de30eff6ebccde5b"  // The Return of the King
];

// Haal quotes op
export async function getQuotes(): Promise<Quote[]> {
    const quotes: Quote[] = [];
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

        const responses = await Promise.all(fetches); // Alle API's tegelijk ophalen
        const dataArray = await Promise.all(responses.map(async (res) => {
            if (!res.ok) throw new Error("Failed to fetch quotes-data");
            return res.json();
        }));

        for (const data of dataArray) {
            const typedData = data as { docs: any[] }; // Typiseer 'data' expliciet
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
        console.error("Error loading quotes:", error);
    }
    return quotes;
}

// Haal karakters op
export async function getCharacter(A3: string): Promise<Character[]> {
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

        const data: { docs: any[] } = await response.json();

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
            spouse: element.spouse
        }));

        characters.push(...charactersFromData);
    } catch (error) {
        console.error("Error loading characters:", error);
    }

    return characters;
}


// APi Movies

export async function getMovie(movieId: string) {
    try {
        const response = await fetch("https://the-one-api.dev/v2/movie", {
            method: "GET",
            headers: {
                Accept: 'aplication/json',
                Authorization: 'Bearer U46P-SKycLF1TNRwxS_l',
            }

        });
        if (!response.ok) {
            throw new Error("internal error");
        }
        const data = await response.json();
        const movie = data.docs.find((doc: any) => doc._id === movieId);
        return `${movie.name}`

    } catch (error) {
        console.log(error)
    }

}

// formule voor anwtoorden

export async function characterAnswers(Q: Quote) {
    let answer1 = quotes[Math.floor(Math.random() * quotes.length)];
    while (Q.character_id === answer1.character_id) {
        answer1 = quotes[Math.floor(Math.random() * quotes.length)];

    }
    let answer2 = quotes[Math.floor(Math.random() * quotes.length)];
    while (answer1.character_id === answer2.character_id || Q.character_id === answer2.character_id) {
        answer2 = quotes[Math.floor(Math.random() * quotes.length)];

    }
    let answerArray = [answer1.character_id, answer2.character_id, Q.character_id];
    console.log("answercharacter", answer1.character_id, answer2.character_id, Q.character_id)
    return answerArray;

}

// random antwoorden genereren
export async function answerRandom(answerArray: string[]) {
    let A1 = answerArray[Math.floor(Math.random() * 3)];
    let A2 = answerArray[Math.floor(Math.random() * 3)];
    while (A1 === A2) {
        A2 = answerArray[Math.floor(Math.random() * 3)];
    }
    let A3 = answerArray.find(answer => answer !== A1 && answer !== A2)!;
    let answerArraymixd = { A1, A2, A3 };
    console.log("randomanswers", A1, A2, A3);
    return answerArraymixd



}