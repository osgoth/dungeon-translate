import { User } from "./user";

export interface AuthResult {
    success: boolean;
    user?: User;
    message?: string;
}
