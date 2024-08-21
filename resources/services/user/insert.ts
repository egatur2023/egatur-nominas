import { prisma } from "@prisma/db";
import { User } from "@prisma/client";

// Función para crear un nuevo usuario
export async function createUser(user: {
    email: string;
    password: string;
    username: string;
    roleId: number;
}): Promise<User> {
    return await prisma.user.create({
        data: {
            email: user.email,
            password: user.password,  // Si no usas encriptación, se almacena tal cual
            username: user.username,
            roleId: user.roleId,
        },
    });
}
