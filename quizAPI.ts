import { Quote, Character } from "./interfaces";

export let quotes: Quote[] = [];

// De quotes worden opgehaald uit deze 3 films
const movieIds = [
    "5cd95395de30eff6ebccde5d", // The Fellowship of the Ring
    "5cd95395de30eff6ebccde5c", // The Two Towers
    "5cd95395de30eff6ebccde5b"  // The Return of the King
];


// Haal quotes op
export async function getQuotes(){
    try {
        let response = await fetch("https://the-one-api.dev/v2/movie/5cd95395de30eff6ebccde5d/quote",{
            method: "GET",
            headers:{
                Accept: 'application/json',
                Authorization: "Bearer HoaloVIwHdpWVRHFhuI0 ",
            }
        })
        if (!response.ok) {
            throw new Error("failed to fetch data")
        }  
        let data = await response.json();
        for (let i = 0; i < data.docs.length; i++) {
            const element = data.docs[i];
            quotes.push({
                _id: element._id,
                dialog: element.dialog,
                movie_id: element.movie,
                character_id: element.character,
                id: element.id
            })
        }
    } catch (error) {
        console.log(error)
    }
    try {
        let response = await fetch("https://the-one-api.dev/v2/movie/5cd95395de30eff6ebccde5c/quote",{
            method: "GET",
            headers:{
                Accept: 'application/json',
                Authorization: "Bearer HoaloVIwHdpWVRHFhuI0 ",
            }
        })
        if (!response.ok) {
            throw new Error("failed to fetch data")
        }  
        let data = await response.json();
        for (let i = 0; i < data.docs.length; i++) {
            const element = data.docs[i];
            quotes.push({
                _id: element._id,
                dialog: element.dialog,
                movie_id: element.movie,
                character_id: element.character,
                id: element.id
            })
        }
    } catch (error) {
        console.log(error)
    }
    try {
        let response = await fetch("https://the-one-api.dev/v2/movie/5cd95395de30eff6ebccde5b/quote",{
            method: "GET",
            headers:{
                Accept: 'application/json',
                Authorization: "Bearer HoaloVIwHdpWVRHFhuI0 ",
            }
        })
        if (!response.ok) {
            throw new Error("failed to fetch data")
        }  
        let data = await response.json();
        for (let i = 0; i < data.docs.length; i++) {
            const element = data.docs[i];
            quotes.push({
                _id: element._id,
                dialog: element.dialog,
                movie_id: element.movie,
                character_id: element.character,
                id: element.id
            })
        }
    } catch (error) {
        console.log(error)
    }
}

// Haal karakters op
export async function getCharacter(characterId: any) {
    try {
        const response = await fetch("https://the-one-api.dev/v2/character", {
            method: "GET",
            headers: {
                Accept: 'application/json',
                Authorization: "Bearer HoaloVIwHdpWVRHFhuI0 ",
            }
        });
        if (!response.ok) {
            throw new Error("internal error");
        }
        const data = await response.json();
        const character = data.docs.find((doc: any) => doc._id === characterId);
        return `${character.name}`;
    } catch (error) {
        console.log(error);
    }
}
//API inladen - movies
export async function getmovie(movieId: string) {
    try {
        const response = await fetch("https://the-one-api.dev/v2/movie", {
            method: "GET",
            headers: {
                Accept: 'application/json',
                Authorization: "Bearer HoaloVIwHdpWVRHFhuI0 ",
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
