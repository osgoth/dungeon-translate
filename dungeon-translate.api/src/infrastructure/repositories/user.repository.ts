import { Collection, MongoClient } from "mongodb";
import { User } from "../../domain/aggregates/user/user";
import { Guid } from "guid-typescript";
import MongoDBConnectionFactory from "../mongodb.config";
import { Role } from "../../domain/aggregates/user/roles";


interface UserDocument extends User {
    _id: string;
    password: string;
    role: Role;
}
class UserRepository {
  private client: MongoClient;
  private collection: Collection<UserDocument>;

  constructor() {
    const factory = MongoDBConnectionFactory.getInstance();
    this.client = factory.getClient();
    this.collection = this.client.db("dungeon_translate").collection("users");
  }

  async create(user: User): Promise<UserDocument> {
    const result = await this.collection.insertOne({ ...user, _id: Guid.create().toString() });
    return await this.collection.findOne({ _id: result.insertedId }) as UserDocument;
  }

  async findAll(filter: Partial<User> = {}): Promise<UserDocument[]> {
    return await this.collection.find(filter).toArray();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return await this.collection.findOne({ _id: id });
  }

  async findByUserName(userName: string): Promise<UserDocument | null> {
    return await this.collection.findOne({ userName:  userName});
  }

  async update(id: string, updateData: Partial<User>): Promise<UserDocument | null> {
    const result = await this.collection.updateOne(
      { _id: id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return null;
    }

    return await this.collection.findOne({ _id: id });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}

export default UserRepository;