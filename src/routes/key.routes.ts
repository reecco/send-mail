import { Router } from "express";

import KeyController from "../controllers/KeyController";
import { authorization as auth } from "../middlewares";

const router = Router();

router
  .get("/user-keys/:id", auth, KeyController.userList)
  // .get("/keys", KeyController.generalList)
  .post("/generate", auth, KeyController.generate)
  .delete("/key", auth, KeyController.delete);

export default router;