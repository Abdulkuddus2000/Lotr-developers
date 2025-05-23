import { User, Quote } from "./interfaces";
import bcrypt from "bcrypt"
import { Collection, MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv"
import { userCollection, connect } from "./database";
import { getQuotes, quotes } from "./quizAPI";
import { updateFavoriteQuotes, updateBlacklistedQuotes } from "./account";


dotenv.config();

// dit moet de favoriete quotes doen opslaan in de db
export async function saveFavoriteQuoteToDatabase(username: string, quoteId: string) {
    try {
        const result = await userCollection.updateOne(
            { username: username },
            { $addToSet: { favoriteQuotesId: quoteId } }
        );

        console.log("Favoriete quote toegevoegd aan de database:", quoteId);
    } catch (error) {
        console.error("Fout bij toevoegen van favoriete quote aan database:", error);
    }
}


// dit moet de blacklisted quotes doen opslaan in de db
export async function saveBlacklistedQuoteToDatabase(username: string, quoteId: string, reason: string) {
    try {
        const result = await userCollection.updateOne(
            { username: username },
            { $addToSet: { blacklistedQuotes: { blacklistedQuoteId: quoteId, blacklistReason: reason } } }
        );

        console.log("Quote succesvol geblacklist in de database:", quoteId);
    } catch (error) {
        console.error("Fout bij blacklisten van quote in database:", error);
    }
}



 // deze functie zorgt ervoor dat de quotes uit de quiz  verwijderd


let quizQuestions: Quote[] = [];
export async function removeQuoteFromQuiz(quoteId: string) {
    try {
        const index = quizQuestions.findIndex(quote => quote._id === quoteId);
        if (index > -1) {
            
            quizQuestions.splice(index, 1);
            console.log("Quote succesvol verwijderd uit de quizvragen.");
        } else {
            console.error("Quote met ID", quoteId, "niet gevonden in de quizvragen.");
        }
    } catch (error) {
        console.error("Fout bij het verwijderen van de quote uit de quizvragen:", error);
        throw error;
    }
}


// deze functie zoekt de quotes op met hun id
export async function findQuoteById(quoteId: string) {
    try {
        const quote = await userCollection.findOne({ _id: new ObjectId(quoteId) });
        console.log("Gevonden quote in database:", quote);
        return quote;
    } catch (error) {
        console.error("Fout bij het ophalen van de quote:", error);
        throw error;
    }



}


