import { Schema as _Schema, model } from 'mongoose';
import { generateUUID } from '../utils/uuidValidator.js';
const Schema = _Schema;

const godownSchema = new Schema({
  _id: { type: String, default: generateUUID },
  name: { type: String, required: true },
  parent_godown: { type: String, default: null }
}, { _id: true });

const Godown = model('Godown', godownSchema);

export default Godown;