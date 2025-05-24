import { ObjectId } from "mongodb";
import { userCollection, quotesCollection, blacklistCollection, client } from "./database";
import { Quote, User, BlacklistedQuote } from "./interfaces";

export async function updateBlacklistedQuotes(user: User, quoteId: string, reason: string) {
    try {
        let currentBlacklistedQuotes: string[] = user.blacklistedQuotedId || [];

        if (!currentBlacklistedQuotes.includes(quoteId)) {
            currentBlacklistedQuotes.push(quoteId);
        }

        await userCollection.updateOne(
            { username: user.username },
            { $set: { blacklistedQuotedId: currentBlacklistedQuotes } }
        );
        const blacklistEntry = {
            blacklistedQuoteId: quoteId,
            blacklistReason: reason,
            user_id: user._id?.toString() || "",
            blacklisted_at: new Date()
        };

        await blacklistCollection.insertOne(blacklistEntry);
    } catch (error) {
        console.error("Fout bij bijwerken van geblackliste quotes:", error);
    }
}

export async function removeQuoteFromQuiz(quoteId: string, sessionId: string, reason: string = "User blacklisted") {
    try {
        const blacklistEntry = {
            blacklistedQuoteId: quoteId,
            blacklistReason: reason,
            user_id: sessionId,
            blacklisted_at: new Date()
        };

        await blacklistCollection.insertOne(blacklistEntry);
        return true;
    } catch (error) {
        console.error('Error removing quote from quiz:', error);
        return false;
    }
}

export async function getRandomQuoteForQuiz(sessionId?: string) {
    try {
        let blacklistedQuoteIds: string[] = [];
        
        if (sessionId) {
            const blacklistedEntries = await blacklistCollection
                .find({ user_id: sessionId })
                .toArray();
            
            blacklistedQuoteIds = blacklistedEntries.map(entry => entry.blacklistedQuoteId);
        }

        const pipeline = [
            { $match: { _id: { $nin: blacklistedQuoteIds } } },
            { $sample: { size: 1 } }
        ];

        const randomQuotes = await quotesCollection.aggregate(pipeline).toArray() as Quote[];
        return randomQuotes.length > 0 ? randomQuotes[0] : null;
    } catch (error) {
        console.error('Error getting random quote for quiz:', error);
        return null;
    }
}

export async function getRandomQuotesForQuiz(count: number = 1, sessionId?: string) {
    try {
        let blacklistedQuoteIds: string[] = [];
        
        if (sessionId) {
            const blacklistedEntries = await blacklistCollection
                .find({ user_id: sessionId })
                .toArray();
            
            blacklistedQuoteIds = blacklistedEntries.map(entry => entry.blacklistedQuoteId);
        }

        const pipeline = [
            { $match: { _id: { $nin: blacklistedQuoteIds } } },
            { $sample: { size: count } }
        ];

        return await quotesCollection.aggregate(pipeline).toArray() as Quote[];
    } catch (error) {
        console.error('Error getting random quotes for quiz:', error);
        return [];
    }
}

export async function getUserBlacklistedQuotesWithDetails(sessionId: string) {
    try {
        const blacklistedEntries = await blacklistCollection
            .find({ user_id: sessionId })
            .sort({ blacklisted_at: -1 })
            .toArray();

        const results = [];
        for (const entry of blacklistedEntries) {
            try {
                const quote = await findQuoteById(entry.blacklistedQuoteId);
                if (quote) {
                    const characterName = await getCharacterNameById(quote.character_id);
                    const movieName = await getMovieNameById(quote.movie_id);
                    
                    results.push({
                        blacklistId: entry._id,
                        quote: {
                            ...quote,
                            character_name: characterName,
                            movie_name: movieName
                        },
                        reason: entry.blacklistReason,
                        blacklisted_at: entry.blacklisted_at
                    });
                }
            } catch (error) {
            }
        }

        return results;
    } catch (error) {
        console.error('Error getting user blacklisted quotes with details:', error);
        return [];
    }
}

export async function removeQuoteFromBlacklistById(blacklistId: string, sessionId: string) {
    try {
        const deleteResult = await blacklistCollection.deleteOne({
            _id: new ObjectId(blacklistId),
            user_id: sessionId
        });

        return deleteResult.deletedCount > 0;
    } catch (error) {
        console.error('Error removing quote from blacklist by ID:', error);
        return false;
    }
}

export async function updateBlacklistReason(blacklistId: string, sessionId: string, newReason: string) {
    try {
        const result = await blacklistCollection.updateOne(
            { _id: new ObjectId(blacklistId), user_id: sessionId },
            { $set: { blacklistReason: newReason, updated_at: new Date() } }
        );
        return result.modifiedCount > 0;
    } catch (error) {
        console.error('Error updating blacklist reason:', error);
        return false;
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

export async function findQuoteById(quoteId: string) {
    try {
        return await quotesCollection.findOne({ _id: new ObjectId(quoteId) }) as unknown as Quote;
    } catch (error) {
        console.error('Error finding quote by ID:', error);
        return null;
    }
}