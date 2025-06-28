import { Guid } from "guid-typescript";

export interface Message {
  text: string;
  userId: Guid;
  roomId: Guid;
  language: string;
}
