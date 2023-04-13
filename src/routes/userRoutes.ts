import { Router } from "express";
import multer from "multer";

import UserController from "../controllers/UserController";
import { authorization as auth } from "../middlewares";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .post("/register", UserController.register)
  .patch('/userphoto', auth, upload.single("image"), UserController.changeUserImage)
  .post("/login", UserController.login)
  // .get("/users", auth, UserController.getUsers)
  .patch("/user", auth, UserController.update)
  .delete("/user", auth, UserController.delete)
  .get("/user/:id", auth, UserController.getUser);

export default router;