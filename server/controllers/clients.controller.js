import * as ClientModel from "../models/client.model.js";

/*
export async function getClients() {
  try {
    const clients = ClientModel.getAllClients();
    res.status(200).json(clients);
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
}
*/

export async function addClient(req, res) {
  try {
    const clientData = req.body;
    const newClient = ClientModel.createClient(clientData);
    res.status(200).json(newClient);
  } catch (err) {
    console.error("Error adding client:", err);
    res.status(500).json({ error: "Failed to add client" });
  }
}
