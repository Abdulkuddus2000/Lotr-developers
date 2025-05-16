//npm install mongodb
import { Collection, MongoClient } from "mongodb";
import dotenv from "dotenv";


dotenv.config();
const uri = process.env.MONGODB_URI ?? "mongodb+srv://lotr_DevelopersAP:lotr_Developers2425@hamsemy445.dlpid9n.mongodb.net/"
const client = new MongoClient(uri);
export const collection:Collection = client.db("lotr_Developer").collection("user");


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
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error(error);
    }
}
