import * as UsersModel from "../models/users.model.js";

export async function checkUser(req, res) {
  try {
    const data = req.body;
    const users = await UsersModel.checkUser(data);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
