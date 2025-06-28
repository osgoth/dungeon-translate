import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import { logger } from "./shared/utils/logger";
import http from "http";
import { Server } from "socket.io";
import roomRouter from "./presentation/routes/room.routes";
import userRouter from "./presentation/routes/user.routes";
import languageRouter from "./presentation/routes/language.routes";
import { RoomHandler } from "./presentation/socket/handlers/room.handler";
import { ChatHandler } from "./presentation/socket/handlers/chat.handler";


const app: Application = express();
const globalRoute = "/api";

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: [ "GET", "POST" ]
  }
});

RoomHandler.register(io);
ChatHandler.register(io);

app.use(cors({origin: "*"}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(globalRoute, (req, res) => {
  res.send("Hello World!");
});


app.use(globalRoute, userRouter);
app.use(globalRoute, roomRouter);
app.use(globalRoute, languageRouter);

const PORT = process.env.PORT || 3000;

try {
  httpServer.listen(PORT, () => {
    logger.info("Server is running on http://localhost:3000");
  });
}
catch (error) {
  logger.error(error);
}

