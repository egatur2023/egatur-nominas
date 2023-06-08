import { File } from 'formidable';
import  { GoogleAuth } from 'google-auth-library';
import  { google }  from 'googleapis'
import path, { resolve } from 'path'
import stream from 'stream'
import fs from "fs"
import PersistentFile from 'formidable/PersistentFile';

const DRIVE_FOLDER_ID : string = "13ga3YZ4mVWcHGekG0ROEBVrDG1DMr3dZ"
export default abstract class DRIVE {

    static async upload(file : File , rename? : string){

        const buffer = fs.createReadStream(file.filepath)
        // const bufferStream = new stream.PassThrough();
        // bufferStream.end(buffer.buffer);
        const auth = new GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/drive',
            keyFile : path.resolve("./key_file_drive.json")
        })

        // console.log(buffer.buffer)
        const service = google.drive({version: 'v3', auth})
          try {
            const uploadFile = await service.files.create({
                requestBody : {
                    name :  rename || file.originalFilename,
                    mimeType: file.mimetype,
                    parents : [DRIVE_FOLDER_ID],
                },
                media : {
                    mimeType: "application/pdf",
                    body : buffer

                },
                fields: 'id',

            })
            return uploadFile?.data?.id || "";
        } catch (err) {
            console.error(err)
            return ""
        }
    }

    static async uploadUpdate(file : File , rename? : string){
        const buffer = fs.createReadStream(file.filepath)
        const auth = new GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/drive',
            keyFile : path.resolve("./key_file_drive.json")
        })

        const service = google.drive({version: 'v3', auth})
          try {
            const uploadFile = await service.files.update({
                requestBody : {
                    name :  rename || file.originalFilename,
                    mimeType: file.mimetype,
                    parents : [DRIVE_FOLDER_ID],
                },
                media : {
                    mimeType: "application/pdf",
                    body : buffer

                },
                fields: 'id',

            })
            return uploadFile?.data?.id || "";
        } catch (err) {
            console.error(err)
            return ""
        }
    }

    static async downloadFile( fileId : string)  {

        const auth = new GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/drive',
            keyFile : path.resolve("./key_file_drive.json")
        })

        const service = google.drive({version: 'v3', auth})

        return await service.files.get(
            {
                fileId: fileId,
                alt: 'media',
            },
            {
                responseType : "stream"
            },
        )
    }
}
