import { Router } from "express";
import multer from "multer";

import UserController from "../controllers/UserController";
import { authorization as auth } from "../middlewares";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .post("/register", UserController.register)
  .patch('/userphoto', upload.single("image"), UserController.changeUserImage)
  .post("/login", UserController.login)
  .get("/users", UserController.getUsers)
  .patch("/user", UserController.update)
  .delete("/user", UserController.delete)
  .get("/user/:id", UserController.getUser);

export default router;