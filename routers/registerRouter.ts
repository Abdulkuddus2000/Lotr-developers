import express from "express";
import { registerUser } from "../database";
import { checkLoggedIn } from "../middleWare/secureMiddleware";


const router = express.Router();

router.get("/register", (req, res) => {
    res.render("register");
});

router.get('/', checkLoggedIn, (req, res) => {
    res.render('register');
});

router.post('/', async (req, res) => {
    const { username, password, "confirm-password": confirmPassword } = req.body;
    
    try {
        if (password !== confirmPassword) {
            return res.render('register', {
                message: 'Wachtwoorden komen niet overeen.',
                username: username
            });
        }
        await registerUser(username, password, "USER");
        req.session.message = {
            type: "success",
            message: "Registratie succesvol. Je kunt nu inloggen."
        };
        
        return res.redirect('/login');
    } catch (error) {
        console.error('Registratie error:', error);
        
        return res.render('register', {
            message: 'Deze username is al in gebruik',
            username: username
        });
    }
});

export default router;