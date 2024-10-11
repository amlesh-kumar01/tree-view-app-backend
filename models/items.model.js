import { Schema as _Schema, model } from 'mongoose';
import { generateUUID } from '../utils/uuidValidator.js';
const Schema = _Schema;

const itemSchema = new Schema({
    _id: { type: String, default: generateUUID},
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, default: "out_of_stock"},
    godown_id: { type: String, required: true },
    brand: { type: String, required: true },
    attributes: {
        type: { type: String, required: true },
        material: { type: String, required: true },
        warranty_years: { type: Number, required: true }
    },
    image_url: { type: String, required: true }
},{_id: true});
itemSchema.pre('save', function(next) {
    this.status = this.quantity > 0 ? "in_stock" : "out_of_stock";
    next();
});  
const Item = model('Item', itemSchema);

export default Item;