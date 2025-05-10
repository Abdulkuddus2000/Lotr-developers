import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import open from "open";
import { error } from "console";
import {getQuotes, getCharacter} from "./data";
import { title } from "process";
// import { apiCall } from "./data";

dotenv.config();

const app : Express = express();

app.use(express.static("public"))
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

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

app.get("/quotes", async (req, res) => {
    try {
        let characters = await getCharacter();
        let quotes = await getQuotes();
        
        res.render("quotes", {
            title: "quotes",
            message: "quotes",
            characters,
            quotes
        });
        console.log("Aantal karakters: ", characters.length);
        console.log("Eerste karakter: ", characters[0]);
    } catch (error) {
        console.error("Fout bij ophalen data: ", error);
        res.status(500).send("Er is iets misgegaan.")
    }

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

app.get("/sudden_death", (req, res) => {
    res.render("sudden_death", {
        title: "sudden_death",
        message: "sudden_death"
    });
});

app.get("/ten_rounds", (req, res) => {
    res.render("ten_rounds", {
        title: "ten_rounds",
        message: "ten_rounds"
    });
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
