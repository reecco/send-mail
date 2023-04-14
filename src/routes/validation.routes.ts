import { Router } from "express";

import ValidationController from "../controllers/ValidationController";

const router = Router();

router
  .post("/recover-password", ValidationController.recoverPassword)
  .get("/verified/:token", ValidationController.validateRegistration)
  .patch("/validate-recover/:token", ValidationController.validateRecovery);

export default router;