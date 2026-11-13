import express from 'express';
import mongoose from 'mongoose';
import Avistamiento from '../models/Avistamiento.js';

const router = express.Router();

function esFormulario(req) {
  return Boolean(req.is('application/x-www-form-urlencoded'));
}

function errorAPI(res, error, mensaje) {
  console.error(mensaje, error);

  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ error: error.message });
  }

  return res.status(500).json({ error: mensaje });
}


router.get('/', async (req, res) => {
  try {
    const filtro = req.query.categoria ? { categoria: req.query.categoria } : {};
    const avistamientos = await Avistamiento.find(filtro)
      .sort({ fechaRegistro: -1, _id: -1 });

    res.status(200).json(avistamientos);
  } catch (error) {
    errorAPI(res, error, 'Error al consultar los avistamientos');
  }
});


router.post('/', async (req, res) => {
  try {
    const {
      nombreComun, nombreCientifico, categoria, zona,
      estadoConservacion, investigador
    } = req.body ?? {};

    const avistamiento = await Avistamiento.create({
      nombreComun,
      nombreCientifico,
      categoria,
      zona,
      
      ...(estadoConservacion ? { estadoConservacion } : {}),
      investigador
    });

    if (esFormulario(req)) {
      return res.redirect(303, '/');
    }

    res.status(201).json(avistamiento);
  } catch (error) {
    errorAPI(res, error, 'Error al crear el avistamiento');
  }
});


async function actualizar(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const cambios = {};
    if (req.body?.zona !== undefined) cambios.zona = req.body.zona;
    if (req.body?.estadoConservacion !== undefined) {
      cambios.estadoConservacion = req.body.estadoConservacion;
    }

    if (Object.keys(cambios).length === 0) {
      return res.status(400).json({ error: 'Envía zona o estadoConservacion' });
    }

    const actualizado = await Avistamiento.findByIdAndUpdate(id, cambios, {
      returnDocument: 'after',
      runValidators: true
    });

    if (!actualizado) {
      return res.status(404).json({ error: 'Avistamiento no encontrado' });
    }

    if (esFormulario(req)) {
      return res.redirect(303, '/');
    }

    res.status(200).json(actualizado);
  } catch (error) {
    errorAPI(res, error, 'Error al actualizar el avistamiento');
  }
}

router.put('/:id', actualizar);
router.post('/update/:id', actualizar);

async function eliminar(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const eliminado = await Avistamiento.findByIdAndDelete(id);

    if (!eliminado) {
      return res.status(404).json({ error: 'Avistamiento no encontrado' });
    }

    if (esFormulario(req)) {
      return res.redirect(303, '/');
    }

    res.status(200).json({ message: 'Avistamiento eliminado correctamente' });
  } catch (error) {
    errorAPI(res, error, 'Error al eliminar el avistamiento');
  }
}

router.delete('/:id', eliminar);
router.post('/delete/:id', eliminar);

export default router;
