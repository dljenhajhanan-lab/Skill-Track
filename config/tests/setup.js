import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

mongoose.set("bufferCommands", false);

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();

  const uri = mongo.getUri();

  await mongoose.connect(uri, {
    dbName: "jest",
  });
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});
