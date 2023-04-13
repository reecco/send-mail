import { Router } from "express";
import EmailController from "../controllers/EmailController";

const router = Router();

router
  .post("/send", EmailController.send);

export default router;