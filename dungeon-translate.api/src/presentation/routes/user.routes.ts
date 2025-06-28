import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();

// TODO: add controllers

router.post("/register", UserController.register);

router.post("/login", UserController.login);

export default router;