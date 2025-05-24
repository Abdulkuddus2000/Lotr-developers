import express, { Express, Request, response, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { User } from "./interfaces";
import  session from "./session";
import {connect} from "./database"
import { getQuotes } from "./quizAPI";
import { secureMiddleware } from "./middleWare/secureMiddleware";
import { flashMiddleware } from "./middleWare/flashMiddleware";
import  loginRouter  from "./routers/logRouter";
import  routers  from "./routers/routers";
import {getFavoriteQuotes, deleteFavoriteQuote , exportFavoriteQuotesToText} from "./FavoriteQuote"
import { getUserBlacklistedQuotesWithDetails, updateBlacklistReason, removeQuoteFromBlacklistById, removeQuoteFromQuiz} from "./BlacklistQuote";


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

app.get("/index", secureMiddleware, (req, res) => {
  res.render("index", {
    title: "Dashboard",
    message: `Welcome, ${req.session.user?.email ?? "Guest"}!`,
    user: req.session.user
  });
});

app.get("/registration", (req, res) => {
    res.render("registration", {
        title: "registration",
        message: "registration"
    });
});




app.get("/favoriteCharacter", (req, res) => {
    res.render("favoriteCharacter", {
        title: "favoriteCharacter",
        message: "favoritCharacter"

    });
});


app.get("/favorites", async (req, res) => {
    const sessionId = req.sessionID; 
    const favoriteQuotes = await getFavoriteQuotes(sessionId);
    res.render("favorites", { favoriteQuotes });
});

app.post("/deleteFavorite", async (req, res) => {
    const quoteId = req.body.quoteId;
    const sessionId = req.sessionID;
    
    await deleteFavoriteQuote(quoteId, sessionId);
    res.redirect("/favorites");
});

app.get("/exportFavorites", async (req, res) => {
    const sessionId = req.sessionID;
    const textContent = await exportFavoriteQuotesToText(sessionId);
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="favorites.txt"');
    res.send(textContent);
});


app.get("/blacklist", async (req, res) => {
    const sessionId = req.sessionID;
    const blacklistedQuotes = await getUserBlacklistedQuotesWithDetails(sessionId);
    res.render("blacklist", { blacklistedQuotes });
});


app.post("/updateBlacklistReason", async (req, res) => {
    const { blacklistId, newReason } = req.body;
    const sessionId = req.sessionID;
    await updateBlacklistReason(blacklistId, sessionId, newReason);
    res.redirect("/blacklist");
});


app.post("/removeFromBlacklist", async (req, res) => {
    const { blacklistId } = req.body;
    const sessionId = req.sessionID;
    await removeQuoteFromBlacklistById(blacklistId, sessionId);
    res.redirect("/blacklist");
});





app.listen(app.get("port"), async() => {
    try {
        await connect();
        console.log("Server started on http://localhost:" + app.get('port'));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
});