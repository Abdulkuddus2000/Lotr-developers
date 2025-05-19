import { MONGODB_URI  } from "../Lotr-developers/database";
import session, { MemoryStore } from "express-session";
import {  FlashMessage, User } from "../Lotr-developers/interfaces";
import mongoDbSession from "connect-mongodb-session";


const MongoDBStore = mongoDbSession(session);

const mongoStore = new MongoDBStore({
    uri: MONGODB_URI,
    collection: "sessions",
    databaseName: "lotr_Developer",
});

declare module 'express-session' {
    export interface SessionData {
        user?: User,
        message?: FlashMessage
    }
}

export default session({
    secret: process.env.SESSION_SECRET ?? "df9372e602b634e15b0129d6a358334a77b4a52462686748978349d4f968c006",
    store: mongoStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
});