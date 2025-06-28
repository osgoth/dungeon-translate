import { Server } from "socket.io";
import { logger } from "../../../shared/utils/logger";
import { RoomEvents } from "../../../domain/aggregates/room/room.events";
import MessageRepository from "../../../infrastructure/repositories/message.repository";
import { Message } from "../../../domain/aggregates/message/message";


export class ChatHandler {
  static register = (io: Server) => {
    // const messageRepository = new MessageRepository();
    io.on("connection", (socket) => {
      logger.info("A user connected:", socket.id);

      // Event: Send a message
      socket.on(RoomEvents.SendMessage, (data: { roomName: string; message: string, userName: string, language: string }) => {
        const { roomName, message, userName, language } = data;
        // const msg: Message = {text: message, roomId: roomName, userId: userName, language: language};

        // messageRepository.create(msg);
        io.to(roomName).emit(RoomEvents.ReceiveMessage, {
          userId: socket.id,
          message,
          userName,
          timestamp: new Date().toISOString(),
          language: language,
          isTranslated: false
        });
      });

      // Event: Translate message
      socket.on(RoomEvents.TranslateMessage, (data: { roomName: string, messageId: string; }) => {
        const { roomName, messageId } = data;
        io.to(data.roomName).emit(RoomEvents.TranslateMessageBroadcast, {
          roomName,
          messageId
        });
      });

      // Event: Disconnect
      socket.on("disconnect", () => {
        logger.info("User disconnected:", socket.id);
      });
    });
  };
}