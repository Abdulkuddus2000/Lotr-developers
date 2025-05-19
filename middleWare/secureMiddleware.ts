import { Request, Response, NextFunction } from "express";

export function secureMiddleware(req: Request, res: Response, next: NextFunction) {
   if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};


export function checkLoggedIn(req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
}