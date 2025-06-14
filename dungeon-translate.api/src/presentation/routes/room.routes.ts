import { Router } from "express";
import { RoomController } from "../controllers/room.controller";

const router = Router();

router.get("/rooms", RoomController.getAllRoomIds);


export default router;
