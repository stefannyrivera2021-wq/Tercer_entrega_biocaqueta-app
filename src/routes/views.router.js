import express from 'express';
import mongoose from 'mongoose';
import Avistamiento from '../models/Avistamiento.js';

const router = express.Router();

const CATEGORIAS = ['Mamífero', 'Ave', 'Reptil', 'Anfibio', 'Flora'];
const ZONAS = ['El Caraño', 'Río Hacha', 'Serranía de Chiribiquete', 'Cordillera Oriental'];
const ESTADOS = [
  { valor: 'Preocupación menor', clase: 'menor' },
  { valor: 'Vulnerable', clase: 'vulnerable' },
  { valor: 'En peligro', clase: 'peligro' }
];

const claseEstado = (estado) =>
  ESTADOS.find((e) => e.valor === estado)?.clase ?? 'menor';

const fecha = (valor) => new Date(valor).toLocaleDateString('es-CO');

router.get('/', async (req, res) => {
  try {
    // .lean() devuelve objetos JS planos que Handlebars puede leer
    const documentos = await Avistamiento.find()
      .sort({ fechaRegistro: -1, _id: -1 })
      .lean();

    const avistamientos = documentos.map((item) => ({
      ...item,
      id: item._id.toString(),
      fechaVisible: fecha(item.fechaRegistro),
      estadoClase: claseEstado(item.estadoConservacion),
      textoBusqueda: [
        item.nombreComun, item.nombreCientifico, item.categoria,
        item.zona, item.estadoConservacion, item.investigador
      ].join(' ').toLowerCase()
    }));

    const total = avistamientos.length;

    // Conteo por categoría (chips de filtro)
    const conteoCategorias = CATEGORIAS.map((nombre) => ({
      nombre,
      cantidad: avistamientos.filter((a) => a.categoria === nombre).length
    }));

    // Termómetro de conservación
    const conservacion = ESTADOS.map(({ valor, clase }) => {
      const cantidad = avistamientos.filter((a) => a.estadoConservacion === valor).length;
      return { valor, clase, cantidad, porcentaje: total ? Math.round((cantidad / total) * 100) : 0 };
    });

    res.render('home', {
      title: 'BioCaquetá | Cuaderno de campo',
      avistamientos,
      total,
      categorias: CATEGORIAS,
      conteoCategorias,
      conservacion,
      enPeligro: conservacion.find((c) => c.clase === 'peligro').cantidad,
      zonas: ZONAS,
      estados: ESTADOS
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar los avistamientos');
  }
});

router.get('/editar/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send('ID inválido');
    }

    const avistamiento = await Avistamiento.findById(req.params.id).lean();
    if (!avistamiento) {
      return res.status(404).send('Avistamiento no encontrado');
    }

    res.render('editar', {
      title: 'BioCaquetá | Editar avistamiento',
      avistamiento: {
        ...avistamiento,
        id: avistamiento._id.toString(),
        fechaVisible: fecha(avistamiento.fechaRegistro)
      },
      zonas: ZONAS,
      estados: ESTADOS.map((e) => ({
        ...e,
        seleccionado: e.valor === avistamiento.estadoConservacion
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el formulario de edición');
  }
});

export default router;
