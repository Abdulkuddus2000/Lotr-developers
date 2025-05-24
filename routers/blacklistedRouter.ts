import { Router } from 'express';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { blacklistCollection } from '../database';
import { getBlacklistedQuotesFormatted, deleteBlacklistedQuote, updateBlacklistReason } from '../BlacklistQuote';
const router = Router();

// Blacklist pagina
router.get("/blacklist", async (req: Request, res: Response) => {
    try {
        const sessionId = req.sessionID;
        const blacklistedQuotes = await getBlacklistedQuotesFormatted(sessionId);
        
        res.render("blacklist", { 
            blacklistedQuotes: blacklistedQuotes,
            username: req.session.user?.username || "Guest"
        });
    } catch (error) {
        console.error("Error loading blacklist:", error);
        res.render("blacklist", { 
            blacklistedQuotes: [], 
            username: "Guest" 
        });
    }
});

// Update blacklist reason
router.post("/updateBlacklistReason", async (req: Request, res: Response) => {
    try {
        const { blacklistId, newReason } = req.body;
        const sessionId = req.sessionID;
        
        await updateBlacklistReason(blacklistId, sessionId, newReason);
        res.redirect("/blacklist");
    } catch (error) {
        console.error("Error updating reason:", error);
        res.redirect("/blacklist");
    }
});

// Remove from blacklist
router.post("/removeFromBlacklist", async (req: Request, res: Response) => {
    try {
        const { blacklistId } = req.body;
        const sessionId = req.sessionID;
        
        await deleteBlacklistedQuote(blacklistId, sessionId);
        res.redirect("/blacklist");
    } catch (error) {
        console.error("Error removing from blacklist:", error);
        res.redirect("/blacklist");
    }
});

export default router;