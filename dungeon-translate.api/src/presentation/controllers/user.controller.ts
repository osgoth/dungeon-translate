import { Request, Response } from "express";
import { UserService } from "../../domain/aggregates/user/user.service";
import { User, UserLogin } from "../../domain/aggregates/user/user";
import { logger } from "../../shared/utils/logger";



export class UserController {
  private static salt = process.env.SALT_ROUNDS!;

  public static login = async (req: Request, resp: Response) => {
    const user = req.body as UserLogin;
    const existingUser = await UserService.loginUser(user);
    if (existingUser.success) {
      resp.status(200).json(existingUser);
      return;
    }
    resp.status(Number(existingUser.message)).end();
  };

  public static register = async (req: Request, resp: Response) => {
    const newUser = req.body as User;
    const registeredUser = await UserService.registerUser(newUser);
    if (registeredUser.success) {
      resp.status(200).json(registeredUser);
      return;
    }
    resp.status(Number(registeredUser.message)).end();
  };
}
