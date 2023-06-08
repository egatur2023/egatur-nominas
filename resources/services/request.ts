import { prisma } from '../../prisma/db'
export async function  getRequestForAdmin(){
    return await prisma.request.findMany({
        include : {
            user : {
                select : {
                    username : true
                }
            },
            subscriptionRoom : {
                select : {
                    id : true,
                    courseName : true,
                    score : true,
                    subscriptionModule : {
                        select : {
                            register :{
                                select : {
                                    id : true,
                                    student : {
                                        select : {
                                            fullName : true
                                        }
                                    },
                                    curricular : {
                                        select : {
                                            code: true
                                        }
                                    }

                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

export async function  getRequestForSuper(){
    return await prisma.request.findMany({
        include : {
            user : {
                select : {
                    username : true
                }
            },
            subscriptionRoom : {
                select : {
                    id : true,
                    courseName : true,
                    score : true,
                    subscriptionModule : {
                        select : {
                            register :{
                                select : {
                                    id : true,
                                    student : {
                                        select : {
                                            fullName : true
                                        }
                                    },
                                    curricular : {
                                        select : {
                                            code: true
                                        }
                                    }

                                }
                            }
                        }
                    }
                }
            }
        }
    })
}
