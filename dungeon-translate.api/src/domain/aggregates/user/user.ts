import { Guid } from "guid-typescript";

export interface User {
  profileName: string;
  userId: Guid;
  languages: string[];
}