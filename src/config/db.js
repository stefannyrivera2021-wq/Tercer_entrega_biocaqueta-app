import dns from "node:dns";
import mongoose from "mongoose";

// En local se usan DNS públicos para resolver el clúster de Atlas.
// En Vercel se deja el DNS del servidor.
if (!process.env.VERCEL) {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

let conexion = null;

// Reutiliza la misma conexión entre peticiones (necesario en Vercel)
export async function conectarDB() {

    if (!process.env.MONGO_URI) {
        throw new Error("Falta MONGO_URI en el archivo .env");
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!conexion) {
        conexion = mongoose.connect(process.env.MONGO_URI, {
            dbName: "biocaqueta_db"
        }).then((m) => {
            console.log("MongoDB Atlas conectado: biocaqueta_db");
            return m.connection;
        }).catch((error) => {
            conexion = null;
            throw error;
        });
    }

    return conexion;
}
