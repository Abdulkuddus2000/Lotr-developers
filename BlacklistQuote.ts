import { ObjectId } from "mongodb";
import { blacklistCollection } from "./database";
import { Quote } from "./interfaces";
import { getCharacter, getmovie } from "./quizAPI";



// Quote toevoegen aan blacklist
export async function saveBlacklistedQuoteToDatabase(quoteData: Quote, sessionId: string, reason = "aanpassen") {
    try {
        console.log(" sla op de quote:", quoteData._id);
        
        const characterName = await getCharacter(quoteData.character_id);
        const movieName = await getmovie(quoteData.movie_id);

        const entry = { quote_id: new ObjectId(quoteData._id), character_name: characterName, movie_name: movieName, dialog: quoteData.dialog, reason, blacklisted_at: new Date(), user_id: sessionId};

        const result = await blacklistCollection.insertOne(entry);
        return { _id: result.insertedId, ...entry };
    } catch (error) {
        if (error instanceof Error) {
            console.error('Save error:', error.message);
        } else {
            console.error('Save error:', error);
        }
        return null;
    }
}

// Blacklist ophalen
export async function getBlacklistedQuotesFormatted(sessionId: string) {
    try {
        const quotes = await blacklistCollection
            .find({ user_id: sessionId })
            .sort({ blacklisted_at: -1 })
            .toArray();
        
        return quotes.map(item => ({ blacklistId: item._id.toString(),reason: item.reason,
            quote: {dialog: item.dialog, character_name: item.character_name, movie_name: item.movie_name}
        }));
    } catch (error) {
        console.error('Error getting blacklisted quotes:', error);
        return [];
    }
}

// Reden updaten
export async function updateBlacklistReason(blacklistId: string, sessionId: string, newReason: string) {
    try {
        if (!ObjectId.isValid(blacklistId)) return false;
        
        const result = await blacklistCollection.updateOne(
            { _id: new ObjectId(blacklistId), user_id: sessionId },
            { $set: { reason: newReason } }
        );
        
        return result.modifiedCount > 0;
    } catch (error) {
        console.error('Error updating blacklist reason:', error);
        return false;
    }
}

// Quote verwijderen
export async function deleteBlacklistedQuote(blacklistId: string, sessionId: string) {
    try {
        if (!ObjectId.isValid(blacklistId)) return false;
        
        const result = await blacklistCollection.deleteOne({
            _id: new ObjectId(blacklistId),
            user_id: sessionId
        });
        
        return result.deletedCount > 0;
    } catch (error) {
        console.error('Error deleting blacklisted quote:', error);
        return false;
    }
}

