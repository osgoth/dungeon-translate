import { Router } from "express";
import { LanguageController } from "../controllers/language.controller";

const router = Router();

router.get("/language", LanguageController.getAllLanguages);

export default router;