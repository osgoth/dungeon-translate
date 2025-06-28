import { Request, Response } from "express";


export class LanguageController {
  private static languages = [
    "Dwarvish",
    "Elvish",
    "Giant",
    "Gnomish",
    "Goblin",
    "Halfling",
    "Orc",
    "Draconic",
    "Infernal",
  ];

  public static async getAllLanguages(req: Request, resp: Response): Promise<void> {
    resp.status(200).json({
      data: LanguageController.languages
    });
  }
}