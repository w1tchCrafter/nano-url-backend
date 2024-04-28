import app from "./app.js";
import connectDatabase from "./database.js";
import { config } from "dotenv";

async function main() {
  try {
    await connectDatabase(process.env.MONGO_URI);
    app.listen(3000, () => console.log("Server listening..."));
  } catch (err) {
    console.error(err);
  }
}

config();
main();
