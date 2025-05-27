import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { User } from "./interfaces";
import  session from "./session";
import {connect} from "./database"
import { getQuotes } from "./quizAPI";
import { secureMiddleware } from "./middleWare/secureMiddleware";
import { flashMiddleware } from "./middleWare/flashMiddleware";
import  loginRouter  from "./routers/logRouter";
import registerRouter from "./routers/registerRouter";
import  gameRouter  from "./routers/gameRouters";
import favoriteRouter from './routers/favoriteRouter';
import blacklistedRouter from './routers/blacklistedRouter';


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
  if (req.session.user) {
    return res.redirect('/index');
  }
  return res.redirect('/login');
});


app.use("/",loginRouter); 

app.use("/", secureMiddleware , gameRouter);

app.use("/registration", registerRouter);


app.get("/index", secureMiddleware, (req, res) => {
  res.render("index", {
    title: "Dashboard",
    message: `Welcome, ${req.session.user?.email ?? "Guest"}!`,
    user: req.session.user
  });
});



app.use('/', favoriteRouter);
app.use('/', blacklistedRouter);



app.listen(app.get("port"), async() => {
    try {
        await connect();
        console.log("Server started on http://localhost:" + app.get('port'));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
});
