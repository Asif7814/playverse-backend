import { Router } from "express";
import profileController from "./controllers.js";
// import { protect } from "../../middlewares/authMiddleware.js";

const profileRouter = Router();

// R - Read all
profileRouter.get("/", profileController.getAllProfiles);

// R - Read one
profileRouter.get("/:id", profileController.getProfileByID);

// U - Update (partial)
profileRouter.patch("/:id", profileController.updateProfile);

export default profileRouter;
