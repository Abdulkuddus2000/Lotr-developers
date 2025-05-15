
import fetch from "node-fetch";
import dotenv from 'dotenv';
import { Quote, Character, Movie } from "./interfaces";

// Laad omgevingsvariabelen
dotenv.config();

export let quotes: Quote[] = [];

// De quotes worden opgehaald uit deze 3 films
const movieIds = [
    "5cd95395de30eff6ebccde5d", // The Fellowship of the Ring
    "5cd95395de30eff6ebccde5c", // The Two Towers
    "5cd95395de30eff6ebccde5b"  // The Return of the King
];


<<<<<<< HEAD

=======
// Haal quotes op
>>>>>>> d803de074a387cb236cf46fac5af7cd75eff5a4d
export async function getQuotes(): Promise<Quote[]> {
    let quotes: Quote[] = [];
    try {
        const fetches = movieIds.map(id =>
            fetch(`https://the-one-api.dev/v2/movie/${id}/quote`, {
                method: "GET",
                headers: {
                    Accept: 'application/json',
                    Authorization: "Bearer HoaloVIwHdpWVRHFhuI0"
                }
            })
        );

<<<<<<< HEAD
        const responses = await Promise.all(fetches); // alle API's tegelijk fetchen
=======
        const responses = await Promise.all(fetches);
>>>>>>> d803de074a387cb236cf46fac5af7cd75eff5a4d
        const dataArray = await Promise.all(responses.map(res => {
            if (!res.ok) throw new Error("Failed to fetch quotes-data");
            return res.json();
        }));

        for (const data of dataArray) {
<<<<<<< HEAD
            const typedData = data as { docs: any[] }; // Explicitly type 'data'
=======
            const typedData = data as { docs: any[] };
>>>>>>> d803de074a387cb236cf46fac5af7cd75eff5a4d
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

<<<<<<< HEAD
=======
// Haal karakters op
>>>>>>> d803de074a387cb236cf46fac5af7cd75eff5a4d
export async function getCharacter(): Promise<Character[]> {
    const characters: Character[] = [];
    try {
        const response = await fetch("https://the-one-api.dev/v2/character", {
    method: "GET",
    headers: {
        Accept: 'application/json',
        Authorization: "Bearer HoaloVIwHdpWVRHFhuI0"
    }
    });

    if (!response.ok) throw new Error("Failed to fetch character-data");

<<<<<<< HEAD
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
      
    }));
        characters.push(...charactersFromData);
    }
    catch (error) {
        console.log(error);
=======
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
            spouse: element.spouse
        }));
        characters.push(...charactersFromData);
>>>>>>> d803de074a387cb236cf46fac5af7cd75eff5a4d
    }
    catch (error) {
        console.log(error);
    }
    return characters;
}

// APi Movies

export async function getMovies(): Promise<any[]> {
<<<<<<< HEAD
    const movies: Movie[] = [];
=======
    const movies: any[] = [];
>>>>>>> d803de074a387cb236cf46fac5af7cd75eff5a4d
    try {
        const response = await fetch("https://the-one-api.dev/v2/movie", {
            method: "GET",
            headers: {
                Accept: 'application/json',
<<<<<<< HEAD
                Authorization: "Bearer HoaloVIwHdpWVRHFhuI0"
=======
                Authorization: process.env.TOKEN ?? ""
>>>>>>> d803de074a387cb236cf46fac5af7cd75eff5a4d
            }
        });

        if (!response.ok) throw new Error("Failed to fetch movie-data");

        const data: any = await response.json();

        const moviesFromData: any[] = data.docs.map((element: any): any => ({
            _id: element._id,
            name: element.name,
            runtimeInMinutes: element.runtimeInMinutes,
            budgetInMillions: element.budgetInMillions,
            boxOfficeRevenueInMillions: element.boxOfficeRevenueInMillions,
            academyAwardNominations: element.academyAwardNominations,
            academyAwardWins: element.academyAwardWins,
            rottenTomatoesScore: element.rottenTomatoesScore
        }));
        movies.push(...moviesFromData);
    }
    catch (error) {
        console.log(error);
    }
    return movies;
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

