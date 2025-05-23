import { User, BlacklistedQuote } from "./interfaces";
import bcrypt from "bcrypt"
import { Collection, MongoClient } from "mongodb";
import dotenv from "dotenv"
import {userCollection} from "./database"

dotenv.config();

const saltRound: number = parseInt(process.env.SALT!);
export let user: User;






export async function updateFavoriteQuotes(user: User, quoteId: string) {
    try {
        console.log("Huidige favoriete quotes voor gebruiker:", user.favoriteQuotesId);

        let currentFavoriteQuotes: string[] = user.favoriteQuotesId || [];

        if (!currentFavoriteQuotes.includes(quoteId)) {
            currentFavoriteQuotes.push(quoteId);
        } else {
            console.log("Quote is al toegevoegd aan favoriete quotes.");
        }

        await userCollection.updateOne(
            { username: user.username },
            { $set: { favoriteQuotesId: currentFavoriteQuotes } }
        );

        console.log("Favoriete quotes bijgewerkt voor gebruiker:", user.username);
        console.log("Nieuwe lijst van favoriete quotes:", currentFavoriteQuotes);
    } catch (error) {
        console.error("Fout bij bijwerken van favoriete quotes:", error);
    }
}


export async function updateBlacklistedQuotes(user: User, quoteId: string, reason: string) {
    try {
        console.log("Huidige geblackliste quotes voor gebruiker:", user.blacklistedQuotes);

        let currentBlacklistedQuotes: BlacklistedQuote[] = user.blacklistedQuotes || [];

        if (!currentBlacklistedQuotes.some(quote => quote.blacklistedQuoteId === quoteId)) {
            currentBlacklistedQuotes.push({ blacklistedQuoteId: quoteId, blacklistReason: reason });
        } else {
            console.log("Quote is al toegevoegd aan geblackliste quotes.");
        }

        await userCollection.updateOne(
            { username: user.username },
            { $set: { blacklistedQuotes: currentBlacklistedQuotes } }
        );

        console.log("Geblackliste quotes bijgewerkt voor gebruiker:", user.username);
        console.log("Nieuwe lijst van geblackliste quotes:", currentBlacklistedQuotes);
    } catch (error) {
        console.error("Fout bij bijwerken van geblackliste quotes:", error);
    }
}





