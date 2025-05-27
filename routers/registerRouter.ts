import express from "express";
import { registerUser } from "../database";
import { checkLoggedIn } from "../middleWare/secureMiddleware";

const router = express.Router();


router.get("/registration", (req, res) => {
    res.render("registration");
});

router.post("/", async (req, res) => {
    const { username, password, "confirm-password": confirmPassword } = req.body;
    
    console.log('Registratie poging:', { username, passwordLength: password?.length });
    
    try {
        if (!username || !password || !confirmPassword) {
            return res.render('registration', { message: 'Alle velden zijn verplicht.', username: username });
        }
        
        if (password.length < 6) {
            return res.render('registration', { message: 'Wachtwoord moet minimaal 6 karakters lang zijn.', username: username });
        }
        
        if (password !== confirmPassword) { return res.render('registration', { message: 'Wachtwoorden komen niet overeen.', username: username });
        }
        
        const result = await registerUser(username, password, "USER");
        console.log('Registratie succesvol:', result);
      
        req.session.message = { type: "success", message: "Registratie succesvol. Je kunt nu inloggen."};
        
        return res.redirect('/login');
        
    } catch (error: any) {
        console.error('Registratie error:', error);
        
        let errorMessage = 'Er is een fout opgetreden bij de registratie.';
        
        if (error.message.includes('username bestaat al')) { errorMessage = 'Deze username is al in gebruik.';
        } else if (error.message.includes('username and password are required')) { errorMessage = 'Username en wachtwoord zijn verplicht.';
        }
        
        return res.render('registration', { message: errorMessage, username: username });
    }
});

export default router;