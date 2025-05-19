import express, { Express, Request, response, Response } from "express";
import express, { Express, Request, response, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { User } from "./interfaces";
import  session from "../Lotr-developers/session";
import {connect} from "./database"
import { getQuotes } from "./quizAPI";
import { secureMiddleware } from "./middleWare/secureMiddleware";
import { flashMiddleware } from "./middleWare/flashMiddleware";
import  loginRouter  from "./routers/logRouter";
import  routers  from "./routers/routers";
import { Quote , Character , Movie} from "./interfaces";




dotenv.config();

const app: Express = express();


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);


app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session);
app.use(flashMiddleware);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.get("/", (req, res) => {
  res.render("landing", {
    title: "Landing Page",
    message: "Welcome to our application"
  });
});

app.use("/",loginRouter); 

app.use("/", secureMiddleware , routers);

app.get("/", (req, res) => {
  if (!req.session.user) {
    return res.render("landing", {
      title: "Landing Page",
      message: "Welcome to our application"
    });
  }
  return res.redirect("/index");
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



app.get("/index", secureMiddleware, (req, res) => {
  res.render("index", {
    title: "Dashboard",
    message: `Welcome, ${req.session.user?.email ?? "Guest"}!`,
    user: req.session.user
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

app.get("/login", (req, res) => {
    res.render("login", {
        title: "login",
        message: "login"
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


app.listen(app.get("port"), async() => {
    try {
        await connect();
        console.log("Server started on http://localhost:" + app.get('port'));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
});