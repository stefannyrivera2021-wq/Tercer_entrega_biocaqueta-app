import mongoose from 'mongoose';

const avistamientoSchema = new mongoose.Schema({
  nombreComun: {
    type: String,
    required: [true, 'El nombre común es obligatorio'],
    trim: true
  },
  nombreCientifico: {
    type: String,
    required: [true, 'El nombre científico es obligatorio'],
    trim: true
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: ['Mamífero', 'Ave', 'Reptil', 'Anfibio', 'Flora']
  },
  zona: {
    type: String,
    required: [true, 'La zona es obligatoria'],
    trim: true
  },
  estadoConservacion: {
    type: String,
    enum: ['Preocupación menor', 'Vulnerable', 'En peligro'],
    default: 'Preocupación menor'
  },
  investigador: {
    type: String,
    required: [true, 'El investigador es obligatorio'],
    trim: true
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});


const Avistamiento = mongoose.model('Avistamiento', avistamientoSchema, 'avistamientos');
export default Avistamiento;
