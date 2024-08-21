// pages/api/user/insert.ts
import { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "../../../resources/services/user/insert";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const user = req.body;
            const newUser = await createUser(user);
            res.status(201).json(newUser);
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ message: "Error al crear el usuario" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
