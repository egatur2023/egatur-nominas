import { NextApiRequest, NextApiResponse } from "next"
import { getUsers } from "resources/services/user/list"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const result = await getUsers()
    return res.status(200).json(result)
}
