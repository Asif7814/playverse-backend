import { Router } from "express";
import tempController from "./controllers.js";
// import { protect } from "../../middlewares/authMiddleware.js";

const tempRouter = Router();

// C - Create
tempRouter.post("/", tempController.createTemp);

// R - Read all
tempRouter.get("/", tempController.getAllTemps);

// R - Read one
tempRouter.get("/:id", tempController.getTempByID);

// U - Update (replace)
tempRouter.put("/:id", tempController.replaceTemp);

// U - Update (partial)
tempRouter.patch("/:id", tempController.updateTemp);

// D - Delete
tempRouter.delete("/:id", tempController.deleteTemp);

export default tempRouter;
