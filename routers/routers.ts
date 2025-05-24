import {Router} from 'express';
import { Request, Response } from 'express';
import dotenv from "dotenv";
import { getCharacter, getmovie, getQuotes, characterAnswers, answerRandom, quotes } from "../quizAPI";
import { updateFavoriteQuotes, saveFavoriteQuoteToDatabase } from "../FavoriteQuote";
import {User} from "../interfaces"
import { removeQuoteFromQuiz } from "../BlacklistQuote";


dotenv.config();

const router = Router();

let counterQuestions = 1;
let counterPoints = 0;

function getRandomSubsetOfQuotes(allQuotes: any[], maxItems: number = 50) {
    if (allQuotes.length <= maxItems) {
        return allQuotes;
    }
    const shuffled = [...allQuotes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, maxItems);
}

router.get("/", (req: Request, res: Response) => {
    res.render("index", { 
        user: req.session.user || { username: "Guest" }
    });
});


//tenRounds router
router.get("/tenRounds", async (req: Request, res: Response) => {
    await getQuotes();
    const limitedQuotes = getRandomSubsetOfQuotes(quotes, 50);

    let obj1 = limitedQuotes[Math.floor(Math.random() * limitedQuotes.length)];
    let answerArray1 = await characterAnswers(obj1);
    let { A1, A2, A3 } = await answerRandom(answerArray1);

    let answer1 = String(await getCharacter(A1));
    let answer2 = String(await getCharacter(A2));
    let answer3 = String(await getCharacter(A3));
    
    console.log("Character Namen:", answer1, answer2, answer3);
    console.log("Types:", typeof answer1, typeof answer2, typeof answer3);
    
    const movies = [
        { id: "5cd95395de30eff6ebccde5d", title: "The Fellowship of the Ring" },
        { id: "5cd95395de30eff6ebccde5c", title: "The Two Towers" },
        { id: "5cd95395de30eff6ebccde5b", title: "The Return of the King" }
    ];
    
    const username = req.session.user ? req.session.user.username : "Guest";
    if (counterQuestions === 1) { counterPoints = 0; } const characterOptions = [ { id: A1, name: answer1 }, { id: A2, name: answer2 }, { id: A3, name: answer3 } ];
    console.log("Character Options:", JSON.stringify(characterOptions));
    
    res.render("tenRounds", { randomQuote: obj1, characterOptions: characterOptions, movies: movies, counter: counterQuestions,  score: Math.floor(counterPoints/2),  username: username });
});


//suddenDeath router
router.get("/suddenDeath", async (req: Request, res: Response) => {
    await getQuotes();
    const limitedQuotes = getRandomSubsetOfQuotes(quotes, 50);

    let obj1 = limitedQuotes[Math.floor(Math.random() * limitedQuotes.length)];
    let answerArray1 = await characterAnswers(obj1);
    let { A1, A2, A3 } = await answerRandom(answerArray1);
    
    let answer1Str = String(await getCharacter(A1));
    let answer2Str = String(await getCharacter(A2));
    let answer3Str = String(await getCharacter(A3));
    
    let answer1 = { answer1: answer1Str, id: A1 };
    let answer2 = { answer2: answer2Str, id: A2 };
    let answer3 = { answer3: answer3Str, id: A3 };

    const movies = [
        { id: "5cd95395de30eff6ebccde5d", title: "The Fellowship of the Ring" },
        { id: "5cd95395de30eff6ebccde5c", title: "The Two Towers" },
        { id: "5cd95395de30eff6ebccde5b", title: "The Return of the King" }
    ];
    
    const username = req.session.user ? req.session.user.username : "Guest";
    if (counterQuestions === 1) { counterPoints = 0; }
    res.render("suddenDeath", { randomQuote: obj1, A1: answer1, A2: answer2, A3: answer3, movies: movies, counter: counterQuestions, counterPoints: counterPoints, username: username });
});



//quiz router
router.post("/checkAnswerCard", async (req: Request, res: Response) => {
    let randomQuote = JSON.parse(req.body.randomQuote);
    const mode = req.body.score;
    counterQuestions++;
    
    const nameAnswer = req.body.nameAnswer;
    const movieAnswer = req.body.movieAnswer;
    console.log("antwoorden", nameAnswer, movieAnswer);
    
    const correctMovie = String(await getmovie(randomQuote.movie_id));
    const correctCharacter = String(await getCharacter(randomQuote.character_id));
    
    if (movieAnswer === correctMovie) { counterPoints++; }
    if (nameAnswer === correctCharacter) { counterPoints++; }
    
    if (mode === 'tenRounds') {
        if (counterQuestions <= 10) {
            res.redirect("/tenRounds");
        } else {
            if (req.session.user && Math.floor(counterPoints/2) > (req.session.user.highscore || 0)) {
                await updateHighscore(Math.floor(counterPoints/2));
            }
            
            res.redirect("/scoreTenRounds");
        }
    } else {
        if (movieAnswer === correctMovie && nameAnswer === correctCharacter) {
            res.redirect("/suddenDeath");
        } else {
            if (req.session.user && Math.floor(counterPoints/2) > (req.session.user.highscore || 0)) {
                await updateHighscore(Math.floor(counterPoints/2));
            }
            
            res.redirect("/scoreSuddenDeath");
        }
    }
});


//scoretenRounds router
router.get("/scoreTenRounds", (req: Request, res: Response) => {
    const finalScore = Math.floor(counterPoints / 2);
    const totalQuestions = 10;
    const percentage = (finalScore / totalQuestions) * 100;
    
    const highScore = req.session.user ? req.session.user.highscore || 0 : 0;
    
    res.render("scoreTenRounds", {
        finalScore: finalScore,
        percentage: percentage,
        highScore: highScore
    });
    
    counterPoints = 0;
    counterQuestions = 1;
});


//scoreSuddenDeath router
router.get("/scoreSuddenDeath", (req: Request, res: Response) => {
    const finalScore = Math.floor(counterPoints / 2);
    const streak = counterQuestions - 1;
    
    const highScore = req.session.user ? req.session.user.highscore || 0 : 0;
    
    res.render("scoreSuddenDeath", {
        finalScore: finalScore,
        streak: streak,
        highScore: highScore
    });
    
    counterPoints = 0;
    counterQuestions = 1;
});

//thumbs up en down router
router.post("/thumbsUpDown", async (req: Request, res: Response) => {
    try {
        const quoteData = JSON.parse(req.body.quoteData);
        const mode = req.body.mode;
        const sessionId = req.sessionID;
        const action = req.body.action; // 'up' or 'down'
        
        if (action === 'up') {
            // Thumbs up - add to favorites
            await saveFavoriteQuoteToDatabase(quoteData, sessionId);
            console.log("Quote added to favorites");
        } else if (action === 'down') {
            // Thumbs down - add to blacklist
            const reason = req.body.reason || "User disliked quote";
            await removeQuoteFromQuiz(quoteData._id, sessionId, reason);
            console.log("Quote added to blacklist");
        }
        
        res.redirect(mode === 'tenRounds' ? "/tenRounds" : "/suddenDeath");
    } catch (error) {
        console.error("Error in thumbsUpDown:", error);
        res.redirect("/");
    }
});
async function updateHighscore(score: number) {
    console.log(`Updating highscore to ${score}`);
}
export default router;