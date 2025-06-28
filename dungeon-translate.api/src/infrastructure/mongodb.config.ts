import { MongoClient, MongoError } from "mongodb";
import { logger } from "../shared/utils/logger";

class MongoDBConfig {
  private static instance: MongoDBConfig;
  private client: MongoClient | null = null;
  private readonly maxRetries: number;
  private readonly retryDelay: number;

  private constructor() {
    this.maxRetries = parseInt(process.env.MONGO_RETRY_ATTEMPTS || "5");
    this.retryDelay = parseInt(process.env.MONGO_RETRY_DELAY || "1000");
  }

  public static getInstance(): MongoDBConfig {
    if (!MongoDBConfig.instance) {
      MongoDBConfig.instance = new MongoDBConfig();
      MongoDBConfig.instance.connect();
    }
    return MongoDBConfig.instance;
  }

  private async connect(): Promise<void> {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
    let retryCount = 0;

    while (retryCount < this.maxRetries) {
      try {
        this.client = new MongoClient(uri);
        await this.client.connect();
        logger.info("Successfully connected to MongoDB");
        break;
      }
      catch (error) {
        retryCount++;
        if (retryCount >= this.maxRetries) {
          logger.error("Failed to connect to MongoDB after multiple attempts", {
            error: (error as MongoError).message,
            attempts: this.maxRetries,
          });
          throw error;
        }
        logger.warn(`Failed to connect to MongoDB. Retrying in ${this.retryDelay}ms...`, {
          error: (error as MongoError).message,
          attempt: retryCount,
        });
        await new Promise((resolve) => {
          return setTimeout(resolve, this.retryDelay);
        });
      }
    }
  }

  public getClient(): MongoClient {
    if (!this.client) {
      throw new Error("MongoDB client not initialized. Call connect() first.");
    }
    return this.client;
  }

  public close(): void {
    if (this.client) {
      try {
        this.client.close();
        this.client = null;
        logger.info("MongoDB connection closed successfully");
      }
      catch (error) {
        logger.error("Failed to close MongoDB connection", {
          error: (error as MongoError).message,
        });
      }
    }
  }

  public dispose(): void {
    this.close();
    logger.info("MongoDB connection factory disposed");
  }
}

// Export a singleton instance for convenience
export const mongoDBFactory = MongoDBConfig.getInstance();

export default MongoDBConfig;
