import formidable, { File, Files } from "formidable";
import fs from 'fs'
import { NextApiRequest } from "next";
import path from "path";

export default abstract class FormidableRequest{

    static async parse( req : NextApiRequest) : Promise<void> {
        const form = new formidable.IncomingForm({multiples : false});
        return new Promise((resolve , reject) => {
            form.parse(req, function (err, fields, files) {
                if(err) reject()
                req.body = {...fields , ...files }
                return resolve()
            })
        })
    }
}
