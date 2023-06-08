import { DateTime } from "luxon";
import { NextApiRequest, NextApiResponse } from "next";
import { DtoCreateRequest, UploadedDocument } from "resources/types";
import FormidableRequest from "resources/utils/formidable.req";
import DRIVE from "resources/utils/google.drive";
export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler( req : NextApiRequest , res : NextApiResponse){

    try {
        await FormidableRequest.parse(req)
        const request : DtoCreateRequest = JSON.parse(req.body.request)
        const { document1 , document2 , document3 } = req.body
        let uploadDocuments : { doc1 : UploadedDocument , doc2 : UploadedDocument , doc3 : UploadedDocument } = {
            doc1 : {...request.doc1 , id : ""} ,
            doc2 : {...request.doc2 , id : ""} ,
            doc3 : {...request.doc3 , id : ""}
        }
        if(!request.userId) return res.status(200).json({message : "datos erroneos."})
        if(document1){
            uploadDocuments.doc1.id = await DRIVE.upload(document1)
        }
        if(document2){
            uploadDocuments.doc2.id = await DRIVE.upload(document2)
        }
        if(document3){
            uploadDocuments.doc3.id = await DRIVE.upload(document3)
        }


        await prisma?.request.create({
            data : {
                reason : request.reason,
                dateRequest   : DateTime.fromISO(String(request.date)).toUTC().toJSDate(),
                observation : "",
                stateUpdate : "PENDIENTE",
                documents : JSON.stringify(uploadDocuments),
                userId : request.userId,
                subscriptionRoomId : request.subRoomId,
            }
        })
        return res.status(200).json(req.body)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message : "No se pudo crear la solicitud."})
    }
}
