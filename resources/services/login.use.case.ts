import { prisma } from '@prisma/db'

export default async function loginUseCase( { email } : {email : string })  {
    return await prisma.user.findFirst({
        where : { email },
        include : {
            role : {
                include : {
                    permissions : {
                        include : {
                            module : true
                        }
                    }
                }
            },
        }
    })
}
