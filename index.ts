import express, { Express, Request, response, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import open from "open";
import { error } from "console";
import { title } from "process";
import { getCharacter, getMovies, getQuotes,characterAnswers,answerRandom, quotes } from "./data";
import { get, request } from "http";
import bodyParser from 'body-parser';
import { Quote } from "./interfaces";
 


dotenv.config();



let counterQuestions: number = 1;
let counterPoints: number = 0;

interface user {
    username: string;
    password: string;
    highScoreTenRounds: number;
    highScoreSuddenDeath: number;
    favorites: string[];
    blacklist: { quoteId: string; reason: string }[];
}

const users: Map<string, user> = new Map();
let currentUser: string | null = null;



const app: Express = express();

app.use(express.static("public"))
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}))

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended:true}))


app.set("port", process.env.PORT ?? 3000);

app.get("/", (req, res) => {
    res.render("landing", {
        title: "landing",
        message: "landing"
    });
});

app.get("/registration", (req, res) => {
    res.render("registration", {
        title: "registration",
        message: "registration"
    });
});

app.get("/account", (req, res) => {
    res.render("account", {
        title: "account",
        message: "account"
    });
});


app.get("/blacklist", (req, res) => {
    res.render("blacklist", {
        title: "blacklist",
        message: "blacklist"
    });
});


app.get("/favoriteCharacter", (req, res) => {
    res.render("favoriteCharacter", {
        title: "favoriteCharacter",
        message: "favoritCharacter"
        
    });
});
app.get("/favorites", (req, res) => {
    res.render("favorites", {
        title: "favorites",
        message: "favorites"
    });
});


app.get("/index", (req, res) => {
    res.render("index", {
        title: "index",
        message: "index"
    });
});

app.get("/login", (req, res) => {
    res.render("login", {
        title: "login",
        message: "login"
    });
});

app.get("/quiz", (req, res) => {
    res.render("quiz", {
        title: "quiz",
        message: "quiz"
    });
});

app.get("/resetPassword", (req, res) => {
    res.render("resetPassword", {
        title: "resetPassword",
        message: "resetPassword"
    });
});


app.get("/tenRounds", async (req, res) => {
    try {
        let characters = await getCharacter();
        let quotes = await getQuotes();
        let movies = await getMovies();
      

        
        res.render("tenRounds", {
            title: "tenRounds",
            message: "tenRounds",
            characters,
            quotes,
            movies
        });
        console.log("Aantal karakters: ", characters.length);
        console.log("Eerste karakter: ", characters[0]);
        console.log("aantal quotes", quotes.length);
        console.log("aantal quotes", quotes[0]);
        console.log("eerste movie", movies.length);
        console.log("eerste movie", movies[0]);
    } catch (error) {
        console.error("Fout bij ophalen data: ", error);
        res.status(500).send("Er is iets misgegaan.")
    }

});















    
    

    


 








    

















app.get("/spelregels", (req, res) => {
    res.render("spelregels", {
        title: "spelregels",
        message: "spelregels"

    }

    );
});


// post-route
app.post("/login", (req, res) => {
    const { username, password, confirmPassword } = req.body;
    const usernames: string[] = [];

    // Simpele checks (je kan eventueel dit naar een aparte functie/module verplaatsen)
    if (!username || username.length < 3) {
        return res.render("registration", { message: "Gebruikersnaam is te kort." });
    }

    if (password !== confirmPassword) {
        return res.render("registration", { message: "Wachtwoorden komen niet overeen." });
    }

    // Simulatie van username-check
    if (usernames.includes(username)) {
        return res.render("registration", { message: "Gebruikersnaam is al in gebruik." });
    }

    // Voeg nieuwe username toe (tijdelijk)
    usernames.push(username);

    // Login is succesvol → render login pagina
    return res.render("login", { title: "login", message: `Welkom, ${username}!` });
});



app.listen(app.get("port"), () => {
    // const url = `http://localhost:${app.get("port")}/landing`;
    // console.log("Server started on ", url);
    // open(url);

    console.log("Server started on http://localhost:" + app.get("port"));
});

function updateHighscore(arg0: number) {
    throw new Error("Function not implemented.");
}
function checkAnswers(nameAnswer: any, movieAnswer: any) {
    throw new Error("Function not implemented.");
}
