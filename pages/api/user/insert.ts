import { NextApiRequest, NextApiResponse } from "next"
import { createUser } from "../../../resources/services/user/insert";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { email, password, username, roleId } = req.body;

        try {
            const result = await createUser({ email, password, username, roleId });
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ error: "Error al crear el usuario" });
        }
    } else {
        return res.status(405).json({ message: "Método no permitido" });
    }
}
