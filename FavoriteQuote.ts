import { ObjectId } from "mongodb";
import { userCollection, quotesCollection, favoritesCollection, client } from "./database";
import { Quote, User, FavoriteQuote } from "./interfaces";

export async function updateFavoriteQuotes(user: User, quoteId: string) {
    try {
        let currentFavoriteQuotes: string[] = user.favoriteQuotesId || [];

        if (!currentFavoriteQuotes.includes(quoteId)) {
            currentFavoriteQuotes.push(quoteId);
        }

        await userCollection.updateOne(
            { username: user.username },
            { $set: { favoriteQuotesId: currentFavoriteQuotes } }
        );
    } catch (error) {
        console.error("Fout bij bijwerken van favoriete quotes:", error);
    }
}

export async function saveFavoriteQuoteToDatabase(quoteData: Quote, sessionId: string) {
    try {
        const characterName = await getCharacterNameById(quoteData.character_id);
        const movieName = await getMovieNameById(quoteData.movie_id);

        const favoriteEntry: FavoriteQuote = {
            quote_id: new ObjectId(quoteData._id),
            character_name: characterName,
            movie_name: movieName,
            dialog: quoteData.dialog,
            added_at: new Date(),
            user_id: sessionId
        };

        const result = await favoritesCollection.insertOne(favoriteEntry);
        return { _id: result.insertedId, ...favoriteEntry };
    } catch (error) {
        console.error('Error saving favorite quote:', error);
    }
}

export async function getFavoriteQuotes(sessionId: string) {
    try {
        return await favoritesCollection
            .find({ user_id: sessionId })
            .sort({ added_at: -1 })
            .toArray() as FavoriteQuote[];
    } catch (error) {
        console.error('Error getting favorite quotes:', error);
        return [];
    }
}

export async function deleteFavoriteQuote(favoriteId: string, sessionId: string) {
    try {
        const deleteResult = await favoritesCollection.deleteOne({
            _id: new ObjectId(favoriteId),
            user_id: sessionId
        });

        return deleteResult.deletedCount > 0;
    } catch (error) {
        console.error('Error deleting favorite quote:', error);
        return false;
    }
}

export async function exportFavoriteQuotesToText(sessionId: string) {
    try {
        const favoriteQuotes = await getFavoriteQuotes(sessionId);
        
        if (favoriteQuotes.length === 0) {
            return 'Je hebt nog geen favoriete quotes.';
        }
        
        let textOutput = '';
        favoriteQuotes.forEach((quote) => {
            textOutput += `${quote.dialog} - ${quote.character_name}\n`;
        });
        
        return textOutput;
    } catch (error) {
        console.error('Error exporting favorite quotes:', error);
        return 'Fout bij exporteren.';
    }
}

export async function getFavoriteQuotesByCharacter(username: string) {
    try {
        const favoriteQuotes = await getFavoriteQuotes(username);
        const groupedQuotes: {[characterName: string]: {quotes: FavoriteQuote[], count: number}} = {};
        
        favoriteQuotes.forEach((quote) => {
            if (!groupedQuotes[quote.character_name]) {
                groupedQuotes[quote.character_name] = { quotes: [], count: 0 };
            }
            groupedQuotes[quote.character_name].quotes.push(quote);
            groupedQuotes[quote.character_name].count++;
        });
        
        return groupedQuotes;
    } catch (error) {
        console.error('Error getting favorite quotes by character:', error);
        return {};
    }
}

export async function getFavoriteQuotesForCharacter(username: string, characterName: string) {
    try {
        const favoriteQuotes = await getFavoriteQuotes(username);
        return favoriteQuotes.filter(quote => quote.character_name === characterName);
    } catch (error) {
        console.error('Error getting favorite quotes for character:', error);
        return [];
    }
}

export async function findQuoteById(quoteId: string) {
    try {
        return await quotesCollection.findOne({ _id: new ObjectId(quoteId) }) as unknown as Quote;
    } catch (error) {
        console.error('Error finding quote by ID:', error);
        return null;
    }
}

async function getCharacterNameById(characterId: string) {
    const character = await client.db("lotr_Developer").collection("characters").findOne({ _id: new ObjectId(characterId) });
    return character?.name || "Unknown Character";
}

async function getMovieNameById(movieId: string) {
    const movie = await client.db("lotr_Developer").collection("movies").findOne({ _id: new ObjectId(movieId) });
    return movie?.name || "Unknown Movie";
}