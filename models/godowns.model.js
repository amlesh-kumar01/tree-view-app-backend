import { Schema as _Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const Schema = _Schema;

const godownSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  parent_godown: { type: String, default: null }
}, { _id: true });

const Godown = model('Godown', godownSchema);

export default Godown;