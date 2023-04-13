import { Router } from "express";
import KeyController from "../controllers/KeyController";

const router = Router();

router
  .get("/user-keys/:id", KeyController.userList)
  .get("/keys", KeyController.generalList)
  .post("/generate", KeyController.generate)
  .delete("/key", KeyController.delete);

export default router;