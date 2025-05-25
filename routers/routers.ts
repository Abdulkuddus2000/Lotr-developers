import {Router} from 'express';
import { Request, Response } from 'express';
import dotenv from "dotenv";
import { Document, ObjectId, WithId } from 'mongodb';
import { getCharacter, getmovie, getQuotes, characterAnswers, answerRandom, quotes } from "../quizAPI";
import { userCollection, } from "../database"; // Pas het pad aan naar je database file
import { updateBlacklistedQuotes,updateFavoriteQuotes } from '../account';
import { saveBlacklistedQuoteToDatabase,saveFavoriteQuoteToDatabase,findQuoteById, removeQuoteFromQuiz } from '../FavoriteQuote';

dotenv.config();

const User = require('../interfaces');
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

// Route om favoriete quotes pagina te tonen
router.get('/favorites', async (req: Request, res: Response) => {
    try {
        const user = req.session?.user;
        
        if (!user) {
            return res.redirect('/login');
        }

        let favoriteQuotes: WithId<Document>[] = [];
        
        // Haal de user data op inclusief favoriete quote IDs
        const userData = await userCollection.findOne({ username: user.username });
        
        if (userData && userData.favoriteQuotesId && userData.favoriteQuotesId.length > 0) {
            // Haal alle favoriete quotes op uit de quotes collectie
            const quoteIds = userData.favoriteQuotesId.map((id: string) => new ObjectId(id));
            favoriteQuotes = await userCollection.find({ _id: { $in: quoteIds } }).toArray();
        }

        res.render('favorites', { 
            favoriteQuotes: favoriteQuotes,
            user: user,
            title: 'Mijn Favoriete Quotes'
        });
        
    } catch (error) {
        console.error('Fout bij ophalen van favoriete quotes:', error);
        res.status(500).render('error', { 
            message: 'Er ging iets mis bij het laden van je favoriete quotes.',
            title: 'Fout'
        });
    }
});

//tenRounds router
router.get("/tenRounds", async (req: Request, res: Response) => {
    try {
        await getQuotes();
        
        // Filter out blacklisted quotes for the current user
        let availableQuotes = quotes;
        if (req.session.user) {
            const userData = await userCollection.findOne({ username: req.session.user.username });
            if (userData && userData.blacklistedQuotes) {
                const blacklistedIds = userData.blacklistedQuotes.map((bq: any) => bq.blacklistedQuoteId);
                availableQuotes = quotes.filter(quote => !blacklistedIds.includes(quote._id));
            }
        }
        
        const limitedQuotes = getRandomSubsetOfQuotes(availableQuotes, 50);

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
        if (counterQuestions === 1) { counterPoints = 0; } 
        
        const characterOptions = [ 
            { id: A1, name: answer1 }, 
            { id: A2, name: answer2 }, 
            { id: A3, name: answer3 } 
        ];
        console.log("Character Options:", JSON.stringify(characterOptions));
        
        res.render("tenRounds", { 
            randomQuote: obj1, 
            characterOptions: characterOptions, 
            movies: movies, 
            counter: counterQuestions,  
            score: Math.floor(counterPoints/2),  
            username: username 
        });
    } catch (error) {
        console.error('Fout bij laden van tenRounds:', error);
        res.status(500).render('error', { 
            message: 'Er ging iets mis bij het laden van de quiz.',
            title: 'Fout'
        });
    }
});

//suddenDeath router
router.get("/suddenDeath", async (req: Request, res: Response) => {
    try {
        await getQuotes();
        
        // Filter out blacklisted quotes for the current user
        let availableQuotes = quotes;
        if (req.session.user) {
            const userData = await userCollection.findOne({ username: req.session.user.username });
            if (userData && userData.blacklistedQuotes) {
                const blacklistedIds = userData.blacklistedQuotes.map((bq: any) => bq.blacklistedQuoteId);
                availableQuotes = quotes.filter(quote => !blacklistedIds.includes(quote._id));
            }
        }
        
        const limitedQuotes = getRandomSubsetOfQuotes(availableQuotes, 50);

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
        
        res.render("suddenDeath", { 
            randomQuote: obj1, 
            A1: answer1, 
            A2: answer2, 
            A3: answer3, 
            movies: movies, 
            counter: counterQuestions, 
            counterPoints: counterPoints, 
            username: username 
        });
    } catch (error) {
        console.error('Fout bij laden van suddenDeath:', error);
        res.status(500).render('error', { 
            message: 'Er ging iets mis bij het laden van de quiz.',
            title: 'Fout'
        });
    }
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

// Route om quote toe te voegen aan favorieten
router.post('/add-favorite', async (req: Request, res: Response) => {
    try {
        const { quoteId } = req.body;
        const user = req.session?.user;
        
        if (!user) {
            return res.status(401).json({ error: 'Niet ingelogd' });
        }

        if (!quoteId) {
            return res.status(400).json({ error: 'Quote ID is vereist' });
        }

        // Controleer of de quote bestaat
        const quote = await userCollection.findOne({ _id: new ObjectId(quoteId) });
        if (!quote) {
            return res.status(404).json({ error: 'Quote niet gevonden' });
        }

        // Gebruik je bestaande functie
        await updateFavoriteQuotes(user, quoteId);
        
        res.json({ 
            success: true, 
            message: 'Quote succesvol toegevoegd aan favorieten' 
        });
        
    } catch (error) {
        console.error('Fout bij toevoegen van favoriete quote:', error);
        res.status(500).json({ error: 'Er ging iets mis bij het toevoegen van de quote' });
    }
});

// Route om favoriete quote te verwijderen
router.post('/remove-favorite', async (req: Request, res: Response) => {
    try {
        const { quoteId } = req.body;
        const user = req.session?.user;
        
        if (!user) {
            return res.status(401).json({ error: 'Niet ingelogd' });
        }

        if (!quoteId) {
            return res.status(400).json({ error: 'Quote ID is vereist' });
        }

        // Verwijder de quote ID uit de favoriteQuotesId array
        const result = await userCollection.updateOne(
            { username: user.username },
            { $pull: { favoriteQuotesId: quoteId } }
        );

        if (result.modifiedCount > 0) {
            console.log(`Quote ${quoteId} verwijderd uit favorieten voor gebruiker ${user.username}`);
            res.json({ success: true, message: 'Quote succesvol verwijderd uit favorieten' });
        } else {
            res.status(404).json({ error: 'Quote niet gevonden in favorieten' });
        }
        
    } catch (error) {
        console.error('Fout bij verwijderen van favoriete quote:', error);
        res.status(500).json({ error: 'Er ging iets mis bij het verwijderen van de quote' });
    }
});

// Route om quote te blacklisten
router.post('/blacklist-quote', async (req: Request, res: Response) => {
    try {
        const { quoteId, reason } = req.body;
        const user = req.session?.user;
        
        if (!user) {
            return res.status(401).json({ error: 'Niet ingelogd' });
        }

        if (!quoteId || !reason) {
            return res.status(400).json({ error: 'Quote ID en reden zijn vereist' });
        }

        // Controleer of de quote bestaat
        const quote = await userCollection.findOne({ _id: new ObjectId(quoteId) });
        if (!quote) {
            return res.status(404).json({ error: 'Quote niet gevonden' });
        }

        // Gebruik je bestaande functies
        await updateBlacklistedQuotes(user, quoteId, reason);
        await removeQuoteFromQuiz(quoteId);
        
        res.json({ 
            success: true, 
            message: 'Quote succesvol geblacklist' 
        });
        
    } catch (error) {
        console.error('Fout bij blacklisten van quote:', error);
        res.status(500).json({ error: 'Er ging iets mis bij het blacklisten van de quote' });
    }
});

// Route om alle blacklisted quotes van een gebruiker op te halen
router.get('/blacklisted-quotes', async (req: Request, res: Response) => {
    try {
        const user = req.session?.user;
        
        if (!user) {
            return res.status(401).json({ error: 'Niet ingelogd' });
        }

        const userData = await userCollection.findOne({ username: user.username });
        const blacklistedQuotes = userData?.blacklistedQuotes || [];

        res.json({ blacklistedQuotes });
        
    } catch (error) {
        console.error('Fout bij ophalen van blacklisted quotes:', error);
        res.status(500).json({ error: 'Er ging iets mis bij het ophalen van blacklisted quotes' });
    }
});

// Route om gebruikersstatistieken op te halen
router.get('/user-stats', async (req: Request, res: Response) => {
    try {
        const user = req.session?.user;
        
        if (!user) {
            return res.status(401).json({ error: 'Niet ingelogd' });
        }

        const userData = await userCollection.findOne({ username: user.username });
        
        if (!userData) {
            return res.status(404).json({ error: 'Gebruiker niet gevonden' });
        }

        const stats = {
            username: userData.username,
            highscore: userData.highscore || 0,
            favoriteQuotesCount: userData.favoriteQuotesId?.length || 0,
            blacklistedQuotesCount: userData.blacklistedQuotes?.length || 0
        };

        res.json({ stats });
        
    } catch (error) {
        console.error('Fout bij ophalen van gebruikersstatistieken:', error);
        res.status(500).json({ error: 'Er ging iets mis bij het ophalen van statistieken' });
    }
});

//thumbs up en down router - UPDATED
router.post("/thumbsUpDown", async (req: Request, res: Response) => {
    try {
        const username = req.session.user?.username || "Guest";
        const quoteData = JSON.parse(req.body.quoteData);
        const mode = req.body.mode;
        const action = req.body.action; // 'favorite' or 'blacklist'
        const reason = req.body.reason; // Voor blacklist
        
        if (username === "Guest") {
            return res.redirect(mode === 'tenRounds' ? "/tenRounds" : "/suddenDeath");
        }

        const user = req.session.user;
        
        if (action === 'favorite') {
            await updateFavoriteQuotes(User, quoteData._id);
            console.log(`Quote ${quoteData._id} toegevoegd aan favorieten voor ${username}`);
        } else if (action === 'blacklist' && reason) {
            await updateBlacklistedQuotes(User, quoteData._id, reason);
            await removeQuoteFromQuiz(quoteData._id);
            console.log(`Quote ${quoteData._id} geblacklist voor ${username} met reden: ${reason}`);
        }
        
        res.redirect(mode === 'tenRounds' ? "/tenRounds" : "/suddenDeath");
        
    } catch (error) {
        console.error('Fout bij thumbsUpDown:', error);
        const mode = req.body.mode;
        res.redirect(mode === 'tenRounds' ? "/tenRounds" : "/suddenDeath");
    }
});

export default router;

function updateHighscore(arg0: number) {
    throw new Error('Function not implemented.');
}
