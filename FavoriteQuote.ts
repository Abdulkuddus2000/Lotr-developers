import { ObjectId } from "mongodb";
import { favoritesCollection } from "./database";
import { Quote } from "./interfaces";
import { getCharacter, getmovie } from "./quizAPI";

// Quote toevoegen aan favorites
export async function saveFavoriteQuoteToDatabase(quoteData: Quote, sessionId: string) {
    try {
        const characterName = await getCharacter(quoteData.character_id);
        const movieName = await getmovie(quoteData.movie_id);

        const entry = {
            quote_id: new ObjectId(quoteData._id),
            character_name: characterName || "Unknown Character",
            movie_name: movieName || "Unknown Movie",
            dialog: quoteData.dialog,
            added_at: new Date(),
            user_id: sessionId
        };

        const result = await favoritesCollection.insertOne(entry);
        return { _id: result.insertedId, ...entry };
    } catch (error) {
        console.error('Error saving favorite quote:', error);
        return null;
    }
}

// Favorites ophalen
export async function getFavoriteQuotes(sessionId: string) {
    try {
        return await favoritesCollection
            .find({ user_id: sessionId })
            .sort({ added_at: -1 })
            .toArray();
    } catch (error) {
        console.error('Error getting favorite quotes:', error);
        return [];
    }
}

// Favorites per character
export async function getFavoriteQuotesForCharacter(sessionId: string, characterName: string) {
    try {
        return await favoritesCollection
            .find({ user_id: sessionId, character_name: characterName })
            .sort({ added_at: -1 })
            .toArray();
    } catch (error) {
        console.error('Error getting favorite quotes for character:', error);
        return [];
    }
}

// Character stats
export async function getCharacterStats(sessionId: string) {
    try {
        const pipeline = [
            { $match: { user_id: sessionId } },
            { $group: { _id: "$character_name", quote_count: { $sum: 1 } } },
            { $sort: { quote_count: -1 } }
        ];
        
        const stats = await favoritesCollection.aggregate(pipeline).toArray();
        return stats.map(stat => ({
            character_name: stat._id,
            quote_count: stat.quote_count
        }));
    } catch (error) {
        console.error('Error getting character stats:', error);
        return [];
    }
}

// Quote verwijderen
export async function deleteFavoriteQuote(favoriteId: string, sessionId: string) {
    try {
        const result = await favoritesCollection.deleteOne({
            _id: new ObjectId(favoriteId),
            user_id: sessionId
        });
        return result.deletedCount > 0;
    } catch (error) {
        console.error('Error deleting favorite quote:', error);
        return false;
    }
}

// Export naar tekst
export async function exportFavoriteQuotesToText(sessionId: string) {
    try {
        const quotes = await getFavoriteQuotes(sessionId);
        
        if (quotes.length === 0) {
            return 'Je hebt nog geen favoriete quotes.';
        }
        
        let output = '';
        quotes.forEach(quote => {
            output += `${quote.dialog} - ${quote.character_name}\n`;
        });
        
        return output;
    } catch (error) {
        console.error('Error exporting favorite quotes:', error);
        return 'Fout bij exporteren.';
    }
}