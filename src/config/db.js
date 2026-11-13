import dns from "node:dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

export async function conectarDB() {

    if (!process.env.MONGO_URI) {
        throw new Error("Falta MONGO_URI en el archivo .env");
    }

    await mongoose.connect(process.env.MONGO_URI, {
        dbName: "biocaqueta_db"
    });

    console.log("MongoDB Atlas conectado: biocaqueta_db");
}