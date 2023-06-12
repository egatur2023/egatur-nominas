import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/db'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    try {
        let user = await prisma.user.findFirst({ where : { email : req.body.email , password : req.body.password } })
        if(user){
            return res.status(200).json(user)
        }
        return res.status(401).json({message : 'Correo y/o contraseña incorrecta(s).'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : 'Error de conexión.'})
    }
}