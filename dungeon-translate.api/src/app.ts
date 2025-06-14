import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import { logger } from "./shared/utils/logger";
import http from "http";
import { Server } from "socket.io";
import roomRouter from "./presentation/routes/room.routes";
import { RoomEvents } from "./domain/aggregates/room/room.events";
import { TranslateService } from "./domain/aggregates/translate/translate.service";




const app: Application = express();
const globalRoute = "/api";

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }});

// Handle socket connections
io.on("connection", (socket) => {
  logger.info("Client connected:", socket.id);

  // Event: Join a room
  socket.on(RoomEvents.JoinRoom, (roomName: string) => {
    socket.join(roomName);
    console.info(`User ${socket.id} joined room: ${roomName}`);
    io.to(roomName).emit(RoomEvents.UserJoined, { userId: socket.id });
  });

  // Event: Leave a room
  socket.on(RoomEvents.LeaveRoom, (roomName: string) => {
    socket.leave(roomName);
    console.log(`User ${socket.id} left room: ${roomName}`);
    io.to(roomName).emit(RoomEvents.UserLeft, { userId: socket.id });
  });

  // Event: Send a message
  socket.on(RoomEvents.SendMessage, (data: { roomName: string; message: string, userName: string }) => {
    const { roomName, message, userName } = data;
    io.to(roomName).emit(RoomEvents.ReceiveMessage, {
      userId: socket.id,
      message,
      userName,
      timestamp: new Date().toISOString(),
      language: "pseudo",
      alphabet: TranslateService.dictionaries["pseudo"],
      isTranslated: false
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    logger.info("Client disconnected:", socket.id);
  });
});


app.use(cors({origin: "*"}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(globalRoute, (req, res) => {
  res.send("Hello World!");
});


app.use(globalRoute, roomRouter);

const PORT = process.env.PORT || 3000;

try {
  httpServer.listen(PORT, () => {
    logger.info("Server is running on http://localhost:3000");
  });
} catch (error) {
  logger.error(error);
}
