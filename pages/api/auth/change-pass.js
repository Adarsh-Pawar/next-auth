import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";
import { connectToDb } from "../../../lib/db";
import { hashPassword, verifyPassword } from "../../../lib/auth";

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (req.method !== "PATCH") {
    res.status(400).json({ message: "Request Method not allowed!" });
    return;
  }
  if (!session) {
    res.status(401).json({ message: "You are not Authenticated!" });
    return;
  }
  const { oldPassword, newPassword } = req.body;

  if (
    !oldPassword ||
    !newPassword ||
    oldPassword.trim() === "" ||
    newPassword.trim() === ""
  ) {
    res.status(422).json({ message: "Invalid Input!" });
    return;
  }

  if (oldPassword === newPassword) {
    res
      .status(422)
      .json({ message: "New Password cannot be same as old password!" });
    return;
  }

  const userEmail = session.user.email;
  let client;
  let user;
  try {
    client = await connectToDb();
    user = await client.db().collection("users").findOne({ email: userEmail });
    if (!user) {
      client.close();
      res.status(404).json({ message: "User not found!" });
      return;
    }
  } catch (error) {
    client.close();
    res.status(500).json({ message: "Internal Server Error!" });
    return;
  }

  if (newPassword.trim().length < 7) {
    client.close();
    res
      .status(422)
      .json({ message: "Password must be atleast 7 characters long!" });
    return;
  }

  const isValidPassword = await verifyPassword(oldPassword, user.password);
  if (!isValidPassword) {
    client.close();
    res.status(403).json({ message: "Incorrect Password!" });
    return;
  }

  const hashedPassword = await hashPassword(newPassword);
  try {
    const result = await client
      .db()
      .collection("users")
      .updateOne({ email: userEmail }, { $set: { password: hashedPassword } });
  } catch (error) {
    client.close();
    res.status(500).json({ message: "Internal Server Error!" });
    return;
  }

  res.status(201).json({ message: "Password Changed" });
  client.close();
};
