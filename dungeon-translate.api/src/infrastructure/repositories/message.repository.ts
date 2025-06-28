import MongoDBConnectionFactory from "../mongodb.config";
import { Message } from "../../domain/aggregates/message/message";
import { MongoClient, Collection } from "mongodb";
import { Guid } from "guid-typescript";

interface MessageDocument extends Message {
  _id: string;
}

class MessageRepository {
  private client: MongoClient;
  private collection: Collection<MessageDocument>;

  constructor() {
    const factory = MongoDBConnectionFactory.getInstance();
    this.client = factory.getClient();
    this.collection = this.client.db("dungeon_translate").collection("messages");
  }

  async create(message: Message): Promise<MessageDocument> {
    const result = await this.collection.insertOne({ ...message, _id: Guid.create().toString() });
    return await this.collection.findOne({ _id: result.insertedId }) as MessageDocument;
  }

  async findAll(filter: Partial<Message> = {}): Promise<MessageDocument[]> {
    return await this.collection.find(filter).toArray();
  }

  async findById(id: string): Promise<MessageDocument | null> {
    return await this.collection.findOne({ _id: id });
  }

  async update(id: string, updateData: Partial<Message>): Promise<MessageDocument | null> {
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

export default MessageRepository;