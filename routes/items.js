import express from "express";
import {addItem,editItem,addQuantity, removeQuantity,getItemsByGodownId,getItemsByCategory,deleteItem,searchItems} from "../controller/itemsController.js";
import ensureAuthenticated from "../middlewares/Authentication.js";
const router = express.Router();

router.use(ensureAuthenticated);
router.get("/", (req, res) => {
  res.send("Hello from items route");
});
router.post("/addItem", addItem);

router.put("/editItem/:_id", editItem);
router.put("/addQuantity/:_id", addQuantity);
router.delete("/deleteItem/:_id", deleteItem);
router.put("/removeQuantity/:_id", removeQuantity);

router.get("/getItemsByGodownId/:godown_id", getItemsByGodownId);
router.get("/getItemsByCategory/:category", getItemsByCategory);
router.get("/searchItems/:searchQuery", searchItems);

export default router;