import { Quote } from "./interfaces";

export let quotes: Quote[] = [];
let allCharacters: any[] = [];
let allMovies: any[] = [];


// alle characters en movies opgeladen
async function loadAllData() {
    if (allCharacters.length > 0) return;
    
    try {
        let response = await fetch("https://the-one-api.dev/v2/character", {
            method: "GET",
            headers: {
                Accept: 'application/json',
                Authorization: "Bearer HoaloVIwHdpWVRHFhuI0 ",
            }
        });
        if (!response.ok) {
            throw new Error("failed to fetch characters");
        }
        let data = await response.json();
        allCharacters = data.docs;
    } catch (error) {
        console.log(error);
    }
    
    try {
        let response = await fetch("https://the-one-api.dev/v2/movie", {
            method: "GET",
            headers: {
                Accept: 'application/json',
                Authorization: "Bearer HoaloVIwHdpWVRHFhuI0 ",
            }
        });
        if (!response.ok) {
            throw new Error("failed to fetch movies");
        }
        let data = await response.json();
        allMovies = data.docs;
    } catch (error) {
        console.log(error);
    }
}
// Haal quotes op
export async function getQuotes() {
    // De quotes worden opgehaald uit deze 3 films
    const movieIds = [
        "5cd95395de30eff6ebccde5d", // Fellowship
        "5cd95395de30eff6ebccde5c", // Two Towers  
        "5cd95395de30eff6ebccde5b"  // Return of King
    ];

    for (const movieId of movieIds) {
        try {
            const response = await fetch(`https://the-one-api.dev/v2/movie/${movieId}/quote`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: "Bearer HoaloVIwHdpWVRHFhuI0 ",
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch ${movieId}`);
            }

            const data = await response.json();
            data.docs.forEach((element: { _id: any; dialog: any; movie: any; character: any; id: any; }) => {
                quotes.push({
                    _id: element._id,
                    dialog: element.dialog,
                    movie_id: element.movie,
                    character_id: element.character,
                    id: element.id
                });
            });
        } catch (error) {
            console.log(error);
        }
    }
}


// Haal karakters op
export async function getCharacter(characterId: any) {
    try {
        await loadAllData();
        
        const character = allCharacters.find((doc: any) => doc._id === characterId);
        if (character) {
            return character.name;
        }
        return "Unknown Character";
    } catch (error) {
        console.log(error);
        return "Error";
    }
}

//API inladen - movies
export async function getmovie(movieId: string) {
    try {
        await loadAllData();
        
        const movie = allMovies.find((doc: any) => doc._id === movieId);
        if (movie) {
            return movie.name;
        }
        
        // Fallback voor bekende movies
        if (movieId === "5cd95395de30eff6ebccde5d") return "The Fellowship of the Ring";
        if (movieId === "5cd95395de30eff6ebccde5c") return "The Two Towers";
        if (movieId === "5cd95395de30eff6ebccde5b") return "The Return of the King";
        
        return "Unknown Movie";
    } catch (error) {
        console.log(error);
        return "Error";
    }
}

//array met antwoorden maken
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
    console.log("characterAnswer", answer1.character_id, answer2.character_id, Q.character_id)
    return answerArray;
}

//antwoorden randomiseren
export async function answerRandom(answerArray: string[]) {
    let A1 = answerArray[Math.floor(Math.random() * 3)];
    let A2 = answerArray[Math.floor(Math.random() * 3)];
    while (A1 === A2) {
        A2 = answerArray[Math.floor(Math.random() * 3)];
    }     
    let A3 = answerArray.find(answer => answer !== A1 && answer !== A2)!;   
    let answerArraymixd = {A1, A2, A3};
    console.log("answerrandom", A1, A2, A3);
    return answerArraymixd
}