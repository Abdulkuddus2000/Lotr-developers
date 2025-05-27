import express from "express";
import { loginUser } from "../database";
import { secureMiddleware, checkLoggedIn } from "../middleWare/secureMiddleware";


const router = express.Router();

router.get('/login', checkLoggedIn, (req, res) => {
    res.render('login');
});


router.post('/login', async (req, res) => {
  console.log('Login form data:', req.body);
  
  const { username, password } = req.body;
  console.log(`Extracted username: "${username}", password present: ${!!password}`);
  
  try {
      const user = await loginUser(username, password);
      console.log('Login successful, user:', { username: user.email, role: user.role });
      
      req.session.user = {
        _id: user._id,
        email: user.email,
        role: user.role,
        username: user.username,
        highscore: user.highscore,
        favoriteQuotesId: user.favoriteQuotesId,
        blacklistedQuotedId: user.blacklistedQuotedId
      };
    
      return res.redirect('/index');
    }  catch (error) {
      console.error('Login error:', error);
    
      return res.render('login', {
      message: 'Onjuiste username of wachtwoord!',
      username: username 
  });
  }
});


router.post("/logout", secureMiddleware, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Fout bij uitloggen:", err);
    }
    res.redirect("/login");
  });
});

export default router;