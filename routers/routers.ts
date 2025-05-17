import {Router} from 'express';
import { Request, Response } from 'express';
import dotenv from "dotenv";
import { Quote , Character , Movie  , Profile} from "../interfaces";
import { getCharacter, getmovie, getQuotes, characterAnswers , answerRandom, quotes } from "../quizAPI";


dotenv.config();

const User = require('../interfaces');

const router = Router();


let counterQuestions = 1;
let counterPoints = 0;




router.get("/tenRounds", async (req, res) => {
    try {
        await getQuotes();
        let obj1 = quotes[Math.floor(Math.random() * quotes.length)];
        let answerArray1 = await characterAnswers(obj1);
        let { A1, A2, A3 } = await answerRandom(answerArray1);
        let answer1 = await getCharacter(A1);
        let answer2 = await getCharacter(A2);
        let answer3 = await getCharacter(A3);
        
        const username = req.session.user ? req.session.user.username : "Guest";
    
        if (counterQuestions === 1) {
            counterPoints = 0;
        }
        
        res.render("tenRounds", { randomQuote: obj1, A1: {answer1}, A2: {answer2}, A3: {answer3}, counter: counterQuestions,counterPoints: counterPoints,username: username
        });
    } catch (error) {
        console.error("Error in tenRounds route:", error);
        res.status(500).send("Error loading quiz");
    }
});


router.post("/tenRounds", async(req, res) => {
    try {
        let randomQuote = JSON.parse(req.body.randomQuote);
        
        const nameAnswer = req.body.nameAnswer;
        const movieAnswer = req.body.movieAnswer;
        console.log("antwoorden", nameAnswer, movieAnswer);
        
        if (movieAnswer === await getmovie(randomQuote.movie_id)) {
            counterPoints++;
        }
        
        if (nameAnswer === await getCharacter(randomQuote.character_id)) {
            counterPoints++;
        }
        
        counterQuestions++;
        
        if (counterQuestions <= 10) {
            res.redirect("/tenRounds");
        } else {

            const currentScore = Math.floor(counterPoints / 2);
            if (req.session.user && currentScore > (req.session.user.highscore || 0)) {
                await updateHighscore(currentScore);
            }
            res.redirect("/scoreTenRounds");
        }
    } catch (error) {
        console.error("Error in tenRounds route:", error);
        res.status(500).send("Error processing quiz answer");
    }
});


router.get("/suddenDeath", async (req, res) => {
    try {
        await getQuotes();
        let obj1 = quotes[Math.floor(Math.random() * quotes.length)];
        let answerArray1 = await characterAnswers(obj1);
        let { A1, A2, A3 } = await answerRandom(answerArray1);
        let answer1 = await getCharacter(A1);
        let answer2 = await getCharacter(A2);
        let answer3 = await getCharacter(A3);
        
        const username = req.session.user ? req.session.user.username : "Guest";
    
        if (counterQuestions === 1) {
            counterPoints = 0;
        }
        
        res.render("suddenDeath", { randomQuote: obj1, A1: {answer1}, A2: {answer2}, A3: {answer3}, counter: counterQuestions,counterPoints: counterPoints,username: username
        });
    } catch (error) {
        console.error("Error in sudden death route:", error);
        res.status(500).send("Error loading quiz");
    }
});


router.post("/suddeDeath", async(req, res) => {
    try {
        let randomQuote = JSON.parse(req.body.randomQuote);
        
        const nameAnswer = req.body.nameAnswer;
        const movieAnswer = req.body.movieAnswer;
        console.log("antwoorden", nameAnswer, movieAnswer);
        
        if (movieAnswer === await getmovie(randomQuote.movie_id)) {
            counterPoints++;
        }
        
        if (nameAnswer === await getCharacter(randomQuote.character_id)) {
            counterPoints++;
        }
        
        counterQuestions++;
        
        if (counterQuestions <= 10) {
            res.redirect("/suddenDeath");
        } else {

            const currentScore = Math.floor(counterPoints / 2);
            if (req.session.user && currentScore > (req.session.user.highscore || 0)) {
                await updateHighscore(currentScore);
            }
            res.redirect("/scoreSuddenDeath");
        }
    } catch (error) {
        console.error("Error in sudden death  route:", error);
        res.status(500).send("Error processing quiz answer");
    }
});

router.post("/checkAnswerCard", async(req, res) => {
    let randomQuote = JSON.parse(req.body.randomQuote);
    counterQuestions++
    const nameAnswer = req.body.nameAnswer;
    const movieAnswer = req.body.movieAnswer;
    console.log( "antwoorden", nameAnswer, movieAnswer);
    if (movieAnswer === await getmovie(randomQuote.movie_id)) {
        counterPoints++;
    }if (nameAnswer === await getCharacter(randomQuote.character_id)) {
        counterPoints++;
    }
    if (counterQuestions !== 11) {
        res.redirect("tenRounds")
    } else {
        if (counterPoints > req.session.user!.highscore) {
            updateHighscore(counterPoints/2)
        }
        res.redirect("scoreTenRounds");
    }
});

router.post("/checkAnswerCard", async(req, res) => {
    let randomQuote = JSON.parse(req.body.randomQuote);
    counterQuestions++
    const nameAnswer = req.body.nameAnswer;
    const movieAnswer = req.body.movieAnswer;
    console.log( "antwoorden", nameAnswer, movieAnswer);
    if (movieAnswer === await getmovie(randomQuote.movie_id)) {
        counterPoints++;
    }if (nameAnswer === await getCharacter(randomQuote.character_id)) {
        counterPoints++;
    }
    if (counterQuestions !== 11) {
        res.redirect("scoreSuddenDeath")
    } else {
        if (counterPoints > req.session.user!.highscore) {
            updateHighscore(counterPoints/2)
        }
        res.redirect("scoreSuddenDeath");
    }
});


router.get("/scoreTenRounds", (req, res) => {
    try {
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
    } catch (error) {
        console.error("Error in scoreTenRounds route:", error);
        res.status(500).send("Error showing quiz results");
    }
});


router.get("/scoreSuddenDeath", (req, res) => {
    try {
        const finalScore = Math.floor(counterPoints / 2);
        const totalQuestions = 10;
        const percentage = (finalScore / totalQuestions) * 100;
        
        const highScore = req.session.user ? req.session.user.highscore || 0 : 0;
        
        res.render("scoreSuddenDeath", {
            finalScore: finalScore,
            percentage: percentage,
            highScore: highScore
        });
        
        counterPoints = 0;
        counterQuestions = 1;
    } catch (error) {
        console.error("Error in scoreSuddenDeath route:", error);
        res.status(500).send("Error showing quiz results");
    }
});


router.post("/thumbsAction", async (req, res) => {
    const username = req.body.username;

    let user = await User.findOne({ username: username });
    if (!user) {
            
        user = new User({ username: username });
        await user.save();
    } 

    if (req.body.thumbsUp) {


    const quoteData = JSON.parse(req.body.quoteData);

        await User.findOneAndUpdate(
            { username: username },
            { $addToSet: { favorites: quoteData._id } }
            );

            console.log("Added quote to favorites");
        } else if (req.body.thumbsDown) {


            const quoteId = req.body.quoteId;
            const reason = req.body.reason;
            await User.findOneAndUpdate(
                { username: username },
                { $addToSet: { blacklist: { quoteId, reason } } }
            );

            console.log("Added quote to blacklist");
    }

    res.redirect("/tenRounds");
});




router.post("/thumbsAction", async (req, res) => {

    const username = req.body.username;
    let user = await User.findOne({ username: username });
    if (!user) {
    user = new User({ username: username });
    await user.save();

    }


    if (req.body.thumbsUp) {

    const quoteData = JSON.parse(req.body.quoteData);

    await User.findOneAndUpdate(
    { username: username },
    { $addToSet: { favorites: quoteData._id } }
        );

        console.log("Added quote to favorites");
    } else if (req.body.thumbsDown) {
            
        const quoteId = req.body.quoteId;
        const reason = req.body.reason;

        await User.findOneAndUpdate(
            { username: username },
            { $addToSet: { blacklist: { quoteId, reason } } }
        );
            console.log("Added quote to blacklist");
    }
        
    res.redirect("/suddenDeath");
});



function updateHighscore(arg0: number) {
    throw new Error("Function not implemented.");
}
function checkAnswers(nameAnswer: any, movieAnswer: any) {
    throw new Error("Function not implemented.");
}

export default router;





