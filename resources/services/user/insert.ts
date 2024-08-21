import { prisma } from "@prisma/db";
import { User } from "@prisma/client";

// Función para crear un nuevo usuario
export async function createUser(user: {
    email: string;
    password: string; // Asegúrate de encriptar la contraseña antes de almacenarla
    username: string;
    roleId: number;
}): Promise<User> {
    try {
        // Crear el usuario
        return await prisma.user.create({
            data: {
                email: user.email,
                password: user.password, // Considera encriptar la contraseña aquí
                username: user.username,
                roleId: user.roleId,
            },
        });
    } catch (error) {
        console.error("Error en la función createUser:", error);
        throw new Error("Error al crear el usuario");
    }
}
