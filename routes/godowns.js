import express from "express";
import { addGodown,getGodowns,getGodownById,getGodownByParentId, getParentGodowns,deleteGodown,renameGodown,changeParentGodown} from "../controller/godownController.js";
import ensureAuthenticated from "../middlewares/Authentication.js";
const router = express.Router();


router.use(ensureAuthenticated);
router.get("/", (req, res) => {
  res.send("Hello from godowns route.");
});

router.get("/getGodowns", getGodowns);
router.get("/getGodownById/:id", getGodownById);
router.get("/getGodownByParentId/:id", getGodownByParentId);
router.get("/getParentGodowns", getParentGodowns);

router.post("/addGodown", addGodown);
router.delete("/deleteGodown/:id",deleteGodown);
router.put("/renameGodown/:id",renameGodown);
router.put("/changeParentGodown/:id",changeParentGodown);

export default router;