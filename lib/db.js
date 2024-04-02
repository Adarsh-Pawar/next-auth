import { MongoClient } from "mongodb";

export async function connectToDb() {
  const client = await MongoClient.connect(
    "mongodb+srv://pawar77:78221277@cluster0.zoyqgsv.mongodb.net/next-auth-demo?retryWrites=true&w=majority&appName=Cluster0"
  );
  return client;
}
