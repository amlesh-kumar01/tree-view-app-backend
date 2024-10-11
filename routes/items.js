import express from "express";
import {addItem,editItem,addQuantity, removeQuantity,getItemsByGodownId,getItemsByCategory} from "../controller/itemsController.js";

const router = express.Router();

router.post("/addItem", addItem);

router.put("/editItem/:_id", editItem);
router.put("/addQuantity/:_id", addQuantity);
router.put("/removeQuantity/:_id", removeQuantity);

router.get("/getItemsByGodownId/:godown_id", getItemsByGodownId);
router.get("/getItemsByCategory/:category", getItemsByCategory);

export default router;