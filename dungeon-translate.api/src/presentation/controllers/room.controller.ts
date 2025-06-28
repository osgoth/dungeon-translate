import { Request, Response } from "express";

export class RoomController {

  private static rooms: number[] = [ 1, 2, 3 ];
  public static async getAllRoomIds(req: Request, resp: Response): Promise<void> {
    resp.status(200).json({
      data: RoomController.rooms,
    });
  }

}