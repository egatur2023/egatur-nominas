// pages/api/user/insert.ts
import { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "../../../resources/services/user/insert";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            console.log("Datos recibidos:", req.body);
            const user = req.body;

            // Verificar que los campos necesarios estén presentes
            if (!user.email || !user.password || !user.username || user.roleId === undefined) {
                return res.status(400).json({ message: "Faltan datos necesarios" });
            }

            const newUser = await createUser(user);
            res.status(201).json(newUser);
        } catch (error) {
            console.error("Error al crear el usuario:", error);

            // Manejo seguro del error
            const errorMessage = (error as Error).message || "Error desconocido";

            res.status(500).json({ message: "Error al crear el usuario", error: errorMessage });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Método ${req.method} No Permitido`);
    }
}
