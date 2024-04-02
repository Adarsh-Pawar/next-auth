import { MongoClient } from "mongodb";

export async function connectToDb() {
  const username=process.env.DB_USERNAME
  const password=process.env.DB_PASSWORD
  const dbName = process.env.DB_NAME
  const cluster = process.env.DB_CLUSTER
  const client = await MongoClient.connect(
    `mongodb+srv://${username}:${password}@cluster0.zoyqgsv.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=${cluster}`
  );
  return client;
}
