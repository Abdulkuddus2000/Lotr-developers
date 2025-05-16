import dotenv from "dotenv"
import session, { MemoryStore } from "express-session";
import mongoDbSession from "connect-mongodb-session";
import { User } from "./interfaces";


const MongoDBStore = mongoDbSession(session);
const mongoStore = new MongoDBStore({
    uri: process.env.MONGODB_URI ?? "mongodb+srv://lotr_DevelopersAP:lotr_Developers2425@hamsemy445.dlpid9n.mongodb.net/",
    collection: "sessions",
    databaseName: "lotr_Developer",

    expires: 1000 * 60 * 60 * 24 * 365, //1jaar
});

declare module 'express-session' {
    export interface SessionData {
        user?: User
    }
}

export default session({
    secret: process.env.SESSION_SECRET ?? "df9372e602b634e15b0129d6a358334a77b4a52462686748978349d4f968c006",
    store: mongoStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
        //maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
});