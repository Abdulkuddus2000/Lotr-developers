import { Collection, MongoClient} from "mongodb";
import dotenv from "dotenv";
import { User, BlacklistedQuote, FavoriteQuote, Quote , } from "./interfaces"
import bcrypt from "bcrypt";


dotenv.config();


const saltRounds : number = 10;
export const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb+srv://lotr_DevelopersAP:lotr_Developers2425@hamsemy445.dlpid9n.mongodb.net/"
export const client = new MongoClient(MONGODB_URI);


export const userCollection:Collection = client.db("lotr_Developer").collection("user");
export const quotesCollection: Collection = client.db("lotr_Developer").collection("quotes");
export const blacklistCollection: Collection<BlacklistedQuote> = client.db("BlacklistedQuote").collection('blacklist');
export const favoritesCollection: Collection<FavoriteQuote> = client.db("FavoriteQuote").collection('favorites');



async function createDefaultUsers() {
  try {
    const userCount = await userCollection.countDocuments({});
    
    if (userCount === 0) {
      console.log("Aanmaken van standaard admin gebruiker...");
      await registerUser("admin", "admin123", "ADMIN");
      console.log("Standaard admin gebruiker succesvol aangemaakt");
    }
  } catch (error) {
    console.error("Fout bij het aanmaken van standaard admin:", error);
  }
}


export async function registerUser(username: string, password: string, role: "ADMIN" | "USER" = "USER") {
  if (!username || !password) {
    throw new Error("username and password are required");
  }
  const existingUser = await userCollection.findOne({ username: username });
  if (existingUser) {
    throw new Error("User met deze username bestaat al");
  }
  
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  await userCollection.insertOne({
    username: username,
    password: hashedPassword,
    role
  });
  
  console.log(`Nieuwe gebruiker geregistreerd: ${username} met rol: ${role}`);
  return { username: username, role, message: "Registratie succesvol! Je wordt doorgestuurd naar de login pagina." };
}




export async function loginUser(username: string, password: string) {
  console.log(`Inlogpoging voor username: ${username}`);
  
  if (!username || !password) {
    console.log('username of wachtwoord ontbreekt');
    throw new Error("username and password are required");
  }
  
  const user = await userCollection.findOne<User>({ username: username });
  
  if (!user) {
    console.log(`Gebruiker met username ${username} niet gevonden`);
    throw new Error("Invalid credentials");
  }
  
  console.log(`Gebruiker gevonden: ${user.username}`);
  console.log(`Stored password hash: ${user.password?.substring(0, 20)}...`);
  console.log(`Attempting to compare with provided password (length: ${password.length})`);
  
  try {
    const passwordMatch = await bcrypt.compare(password, user.password!);
    console.log(`Wachtwoord komt overeen: ${passwordMatch}`);
    
    if (!passwordMatch) {
        throw new Error("Invalid credentials");
    }
  
    const safeUser = { ...user };
    delete safeUser.password;
    console.log(`Inloggen gelukt voor: ${safeUser.username}`);
    return safeUser;
  } catch (error) {
    console.error('Fout bij wachtwoordvergelijking:', error);
    throw new Error("Invalid credentials");
  }
}



async function debugUsers() {
  try {
    const users = await userCollection.find({}).toArray();
    console.log(`Aantal gebruikers in database: ${users.length}`);
    
    if (users.length > 0) {
      console.log('Gedetailleerde gebruikersinformatie:');
      users.forEach(user => {
        console.log('Gebruiker object:', JSON.stringify(user));
        console.log('Beschikbare sleutels:', Object.keys(user));
      });
    } else {
      console.log('Geen gebruikers gevonden in de database!');
    }
  } catch (error) {
    console.error('Fout bij ophalen gebruikers:', error);
  }
}



async function exit() {
  try {
    await client.close();
    console.log("Disconnected from database");
    process.exit(0);
  } catch (error) {
    console.error("Error during disconnection:", error);
    console.error(error);
  }
}

export async function connect() {
    try {
        await client.connect();
        await debugUsers();
        await createDefaultUsers();
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error(error);
    }
}

export { Collection };