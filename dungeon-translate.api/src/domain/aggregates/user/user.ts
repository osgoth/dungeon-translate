import { Role } from "./roles";

export interface User {
  userName: string;
  languages: string[];
  password: string;
  role: Role;
}

export interface UserLogin {
  userName: string;
  password: string;
}