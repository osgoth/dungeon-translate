import UserRepository from "../../../infrastructure/repositories/user.repository";
import { AuthResult } from "./authResult";
import { Role } from "./roles";
import { User, UserLogin } from "./user";
import bcrypt from "bcrypt";
import { logger } from "../../../shared/utils/logger";


export class UserService {
  private static saltRounds: number = +process.env.SALT_ROUNDS!;
  public static registerUser = async (newUser: User): Promise<AuthResult> => {
    logger.debug(`trying to register user with name: ${newUser.userName}`);
    const salt = await bcrypt.genSalt(this.saltRounds);
    const userRepository = new UserRepository();
    const existingUser = await userRepository.findByUserName(newUser.userName);
    if (existingUser) {
      return { success: false, message: "409" };
    }
    const passwordHash = await bcrypt.hash(newUser.password, salt);
    return {
      success: true,
      user: await userRepository.create({
        userName: newUser.userName,
        password: passwordHash,
        languages: newUser.languages,
        role: Role.USER
      })
    };
  };

  public static loginUser = async (existingUser: UserLogin): Promise<AuthResult> => {
    const userRepository = new UserRepository();
    const user = await userRepository.findByUserName(existingUser.userName);
    if (user === null) {
      return { success: false, message: "401" };
    }
    const isPasswordHashValid = await bcrypt.compare(existingUser.password, user!.password);
    if (!isPasswordHashValid) {
      return { success: false, message: "401" };
    }
    return { success: true, user: user };
  };

}