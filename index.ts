import express, { Express, Request, response, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import ejs from "ejs";
import router from "./routers/routers"
import { User } from "./interfaces";
import  session from "./session";
import {connect} from "./database"
import { getQuotes } from "./quizAPI";
import { middleWare } from "./middleWare/middleWare";
import { Quote , Character , Movie} from "./interfaces";




dotenv.config();

const app: Express = express();


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("port", 3000);


app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session);

app.use("/", router); 


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


/*
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


*/


app.listen(app.get("port"), async () => {
    await getQuotes()
    await connect()
  console.log("[server] on http://localhost:" + app.get("port"))
});
