import { Server } from "socket.io";
import { RoomEvents } from "../../../domain/aggregates/room/room.events";
import { logger } from "../../../shared/utils/logger";



export class RoomHandler {

  public static register = (io: Server) => {
    io.on("connection", (socket) => {

      // Event: Join a room
      socket.on(RoomEvents.JoinRoom, (roomName) => {
        socket.join(roomName);
        logger.info(`User ${socket.id} joined room: ${roomName}`);
        io.to(roomName).emit(RoomEvents.UserJoined, { userId: socket.id });
      });

      // Event: Leave a room
      socket.on(RoomEvents.LeaveRoom, (roomName: string) => {
        socket.leave(roomName);
        logger.info(`User ${socket.id} left room: ${roomName}`);
        io.to(roomName).emit(RoomEvents.UserLeft, { userId: socket.id });
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        logger.info("Client disconnected:", socket.id);
      });
    });
  };
}