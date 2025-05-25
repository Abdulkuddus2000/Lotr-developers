import { Router } from 'express';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { favoritesCollection } from '../database';
import { getFavoriteQuotes, getFavoriteQuotesForCharacter, getCharacterStats, deleteFavoriteQuote, exportFavoriteQuotesToText} from '../FavoriteQuote';

const router = Router();

router.get("/favorites", async (req: Request, res: Response) => {
    try {
        const sessionId = req.sessionID;
        const favoriteQuotes = await getFavoriteQuotes(sessionId);
        const characterStats = await getCharacterStats(sessionId);
        const username = req.session.user ? req.session.user.username : "Guest";
        
        res.render("favorites", {  // Gewijzigd van "favoriteQuotes" naar "favorites"
            favoriteQuotes: favoriteQuotes,
            characterStats: characterStats,
            username: username
        });
    } catch (error) {
        console.error("Error loading favorites:", error);
        res.render("favorites", {  // Gewijzigd van "favoriteQuotes" naar "favorites"
            favoriteQuotes: [],
            characterStats: [],
            username: "Guest"
        });
    }
});

router.get("/favorites/:character", async (req: Request, res: Response) => {
    try {
        const sessionId = req.sessionID;
        const characterName = req.params.character.replace(/_/g, ' ');
        const favoriteQuotes = await getFavoriteQuotesForCharacter(sessionId, characterName);
        const username = req.session.user ? req.session.user.username : "Guest";
        
        res.render("favoritesByCharacter", { 
            favoriteQuotes: favoriteQuotes,
            characterName: characterName,
            username: username
        });
    } catch (error) {
        console.error("Error loading favorites by character:", error);
        res.redirect("/favorites");
    }
});

router.post("/deleteFavorite", async (req: Request, res: Response) => {
    try {
        const favoriteId = req.body.quoteId;
        const sessionId = req.sessionID;
        
        await deleteFavoriteQuote(favoriteId, sessionId);
        res.redirect("/favorites");
    } catch (error) {
        console.error("Error deleting favorite:", error);
        res.redirect("/favorites");
    }
});

router.get("/exportFavorites", async (req: Request, res: Response) => {
    try {
        const sessionId = req.sessionID;
        const textContent = await exportFavoriteQuotesToText(sessionId);
        
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', 'attachment; filename="favorite_quotes.txt"');
        res.send(textContent);
    } catch (error) {
        console.error("Error exporting favorites:", error);
        res.redirect("/favorites");
    }
});

export default router;