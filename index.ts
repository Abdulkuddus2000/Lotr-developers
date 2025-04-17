import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import open from "open";
import { error } from "console";

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
        title: "Registration",
        message: "Maak een account aan"
    });
});

app.get("/account", (req, res) => {
    res.render("account", {
        title: "Account",
        message: "Account settings"
    });
});

app.get("/blacklist", (req, res) => {
    res.render("blacklist", {
        title: "Blacklist",
        message: "Overview of your blacklisted items"
    });
});

app.get("/favoriteCharacter", (req, res) => {
    res.render("favoriteCharacter", {
        title: "Favorite character",
        message: "Your favorite character"
    });
});

app.get("/favorites", (req, res) => {
    res.render("favorites", {
        title: "Favorite characters",
        message: "Your favorite characters"
    });
});

app.get("/index", (req, res) => {
    res.render("index", {
        title: "Home",
        message: "Welcome to Lord Of The Rings"
    });
});

app.get("/login", (req, res) => {
    res.render("login", {
        title: "Login",
        message: "Login to your account"
    });
});

app.get("/quiz", (req, res) => {
    res.render("quiz", {
        title: "Quiz",
        message: "Start the quiz"
    });
});

app.get("/resetPassword", (req, res) => {
    res.render("resetPassword", {
        title: "Reset password",
        message: "Reset your password"
    });
});

app.get("/sudden_death", (req, res) => {
    res.render("sudden_death", {
        title: "Sudden death",
        message: "Sudden death"
    });
});

app.get("/ten_rounds", (req, res) => {
    res.render("ten_rounds", {
        title: "10 rounds",
        message: "10 rounds"
    });
});



// post-route
// app.post("/login", (req, res) => {
//     const { username, password, confirmPassword } = req.body;
//     const usernames: string[] = [];

//     // Simpele checks (je kan eventueel dit naar een aparte functie/module verplaatsen)
//     if (!username || username.length < 3) {
//         return res.render("registration", { message: "Gebruikersnaam is te kort." });
//     }

//     if (password !== confirmPassword) {
//         return res.render("registration", { message: "Wachtwoorden komen niet overeen." });
//     }

//     // Simulatie van username-check
//     if (usernames.includes(username)) {
//         return res.render("registration", { message: "Gebruikersnaam is al in gebruik." });
//     }

//     // Voeg nieuwe username toe (tijdelijk)
//     usernames.push(username);
    
//     // Login is succesvol → render login pagina
//     return res.render("login", { title: "login", message: `Welkom, ${username}!` });
// });


// registratie en login:
interface User {
    username: string;
    password: string;
}

const users: User[] = [];

// registratie POST-route
app.post("/registration", (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (!username || username.length < 3) {
        return res.render("registration", { message: "Gebruikersnaam is te kort." });
    }

    if (password !== confirmPassword) {
        return res.render("registration", { message: "Wachtwoorden komen niet overeen." });
    }

    const allreadyExists = users.some((user) => user.username === username);

    if (allreadyExists) {
        return res.render("registration", { message: "Gebruikersnaam is al in gebruik." });
    }


    //gbruiker toevoegen
    users.push({ username, password });
    console.log("Gebruikerslijst:", users); // debug

    res.render("login", { message: "Account succesvol aangemaakt. LOG NU IN!!!" });
});

// login POST-route
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const foundUser = users.find(
        (user) => user.username === username && user.password == password
    );

    if (!foundUser) {
        return res.render("login", { message: "Ongeldige login gegevens." });
    }

    // succesvol ingelogd
    res.render("index", { message: `Welkom terug, ${username}` });
});

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get("port"));
});