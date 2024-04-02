import { hashPassword } from "../../../lib/auth";
import { connectToDb } from "../../../lib/db";

async function handler(req, res) {

  if (req.method !== "POST") {
    return;
  }
  const data = req.body;
  const { email, password } = data;

  if (
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(422).json({ message: "Invalid Input" });
    return
  }
  const hashedpassword = await hashPassword(password);

  let client;
  try {
    client = await connectToDb();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Connecting to the database failed!", error: error });
    client.close();
    return;
  }

  try {
    const db = client.db();
    const existingUser = await db.collection("users").findOne({ email: email });
    if (existingUser) {
      res.status(422).json({ message: "User alredy exists!" });
      client.close();
      return;
    }

    const result = await db.collection("users").insertOne({
      email: email,
      password: hashedpassword,
    });
  } catch (error) {
    res.status(500).json({ message: "Inserting data failed!", error: error });
    client.close();
    return;
  }

  res.status(201).json({ message: "User Created!" });
  client.close();
}

export default handler;
