import { NextApiRequest, NextApiResponse } from "next";
import DRIVE from "resources/utils/google.drive";

export const config = {
    api: {
        responseLimit: '8mb',
    },
}

export default async function handler(req : NextApiRequest , res : NextApiResponse){
    const fileId = String(req.body.fileId)
    // const extension = String(req.body.extension).toLowerCase()

    if(req.body.fileId){
        try {
            const readableStream = await DRIVE.downloadFile(fileId)
            res.setHeader('Content-Type', readableStream.headers['content-type']);
            res.setHeader('Content-Disposition', 'attachment; filename=dummy.pdf');
            return readableStream.data.pipe(res)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message : "Error al descargar"})
        }

    }
    return res.status(500).json({ message : "Identificador de archivo no definido."})
}
