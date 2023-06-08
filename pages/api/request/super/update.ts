import { DateTime } from 'luxon'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getRequestForAdmin } from 'resources/services/request'
import { DtoEditRequestSuper, DtoResRequestsForAdmin, UploadedDocument } from 'resources/types'
import FormidableRequest from 'resources/utils/formidable.req'
import DRIVE from 'resources/utils/google.drive'

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {

    try {
        await FormidableRequest.parse(req)
        const request : DtoEditRequestSuper = JSON.parse(req.body.request)
        const { document1 , document2 , document3 } = req.body
        let uploadDocuments : { doc1 : UploadedDocument , doc2 : UploadedDocument , doc3 : UploadedDocument } = {
            doc1 : {...request.doc1 } ,
            doc2 : {...request.doc2 } ,
            doc3 : {...request.doc3 }
        }
        if(!request.requestId) return res.status(200).json({message : "datos erroneos."})
        if(document1){
            if(!uploadDocuments.doc1.id){
                uploadDocuments.doc1.id = await DRIVE.upload(document1)
            }else{
                let updatedId = await DRIVE.uploadUpdate(document1)
                console.log(updatedId)
            }
        }
        if(document2){
            if(!uploadDocuments.doc2.id){
                uploadDocuments.doc2.id = await DRIVE.upload(document2)
            }else{
                let updatedId = await DRIVE.uploadUpdate(document2)
                console.log(updatedId)
            }
        }
        if(document3){
            if(!uploadDocuments.doc3.id){
                uploadDocuments.doc3.id = await DRIVE.upload(document3)
            }else{
                let updatedId = await DRIVE.uploadUpdate(document3)
                console.log(updatedId)
            }
        }

        const requestUpdated = await prisma?.request.update({
            where : {
                id : request.requestId
            },
            data : {
                reason : request.reason,
                documents : JSON.stringify(uploadDocuments),
            }
        })

        return res.status(200).json(requestUpdated)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : "No se pudo actualizar la solicitud."})
    }
}
