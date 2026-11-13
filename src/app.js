import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { engine } from 'express-handlebars';
import { conectarDB } from './config/db.js';
import apiRouter from './routes/api.router.js';
import viewsRouter from './routes/views.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// En local sirve /public; en Vercel lo sirve su CDN automáticamente
app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Asegura la conexión a MongoDB Atlas antes de atender cada petición
app.use(async (req, res, next) => {
  try {
    await conectarDB();
    next();
  } catch (error) {
    console.error('Error de conexión a MongoDB:', error.message);
    res.status(503).send('No se pudo conectar a la base de datos');
  }
});

app.use('/api/avistamientos', apiRouter);
app.use('/', viewsRouter);

app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

// En local se levanta el servidor; en Vercel se exporta la app
if (!process.env.VERCEL) {
  try {
    await conectarDB();
    app.listen(PORT, () => {
      console.log(`Servidor activo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar BioCaquetá:', error.message);

    if (error.reason?.servers) {
      for (const [servidor, informacion] of error.reason.servers) {
        console.log('Servidor:', servidor);
        console.log('Error específico:', informacion.error?.message ?? 'Sin detalle');
        console.log('Código:', informacion.error?.code ?? 'Sin código');
      }
    }

    process.exit(1);
  }
}

export default app;
