import { DtoFilterReport, DtoResponseReport } from 'resources/types'
import { prisma } from '../../prisma/db'

type DtoBodyReport = {
    careerId? : number
    curricularId? : number
    admision?: string
    dateStart : string
    dateEnd : string
}


export async function filterByCurricularId({ curricularId , dateStart , dateEnd } : DtoBodyReport) : Promise<DtoResponseReport[]> {
    const registers = await prisma.register.findMany({
        where : {
            curricularId : curricularId,
            subscriptionsModule : {
                some : {
                    subscriptionsRoom : {
                        some : {
                            room :{
                                dateStart : {
                                    gte : new Date(dateStart)
                                },
                                dateEnd : {
                                    lte : new Date(dateEnd)
                                }
                            }
                        }
                    }
                }
            }
        },
        include : {
            curricular : {
                include : {
                    career : true
                }
            },
            student : true,
            subscriptionsModule : {
                include : {
                    module : true,
                    subscriptionsRoom : {
                        include : {
                            room : {
                                include : {
                                    teacher : true
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    let response : DtoResponseReport[] = []
    registers.forEach(register => (
        register.subscriptionsModule.forEach( subM =>
            subM.subscriptionsRoom.forEach(subRoom => response.push({
                    studentFullName : register.student.fullName,
                    admision : register.student.admision,
                    schedule : subRoom.room.schedule,
                    careerName : register.curricular.career.name,
                    curricularName : register.curricular.code,
                    moduleName : subM.module.name,
                    courseName : subRoom.courseName,
                    teacherFullName : subRoom.room.teacher?.fullName || "",
                    score : subRoom.score,
            }))
        )
    ))
    return response
}


export async function filterByCareerId({ careerId , dateStart , dateEnd } : DtoBodyReport) : Promise<DtoResponseReport[]> {
    const registers = await prisma.register.findMany({
        where : {
            curricular : {
                careerId: careerId
            },
            subscriptionsModule : {
                some : {
                    subscriptionsRoom : {
                        some : {
                            room :{
                                dateStart : {
                                    gte : new Date(dateStart)
                                },
                                dateEnd : {
                                    lte : new Date(dateEnd)
                                }
                            }
                        }
                    }
                }
            }
        },
        include : {
            curricular : {
                include : {
                    career : true
                }
            },
            student : true,
            subscriptionsModule : {
                include : {
                    module : true,
                    subscriptionsRoom : {
                        include : {
                            room : {
                                include : {
                                    teacher : true
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    let response : DtoResponseReport[] = []
    registers.forEach(register => (
        register.subscriptionsModule.forEach( subM =>
            subM.subscriptionsRoom.forEach(subRoom => response.push({
                    studentFullName : register.student.fullName,
                    admision : register.student.admision,
                    schedule : subRoom.room.schedule,
                    careerName : register.curricular.career.name,
                    curricularName : register.curricular.code,
                    moduleName : subM.module.name,
                    courseName : subRoom.courseName,
                    teacherFullName : subRoom.room.teacher?.fullName || "",
                    score : subRoom.score,
            }))
        )
    ))
    return response
}


export async function filterByAdmision({ admision , dateStart , dateEnd } : DtoBodyReport) : Promise<DtoResponseReport[]> {
    const registers = await prisma.register.findMany({
        where : {
            student:{
                admision: admision
            },
            subscriptionsModule : {
                some : {
                    subscriptionsRoom : {
                        some : {
                            room :{
                                dateStart : {
                                    gte : new Date(dateStart)
                                },
                                dateEnd : {
                                    lte : new Date(dateEnd)
                                }
                            }
                        }
                    }
                }
            }
        },
        include : {
            curricular : {
                include : {
                    career : true
                }
            },
            student : true,
            subscriptionsModule : {
                include : {
                    module : true,
                    subscriptionsRoom : {
                        include : {
                            room : {
                                include : {
                                    teacher : true
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    let response : DtoResponseReport[] = []
    registers.forEach(register => (
        register.subscriptionsModule.forEach( subM =>
            subM.subscriptionsRoom.forEach(subRoom => response.push({
                    studentFullName : register.student.fullName,
                    admision : register.student.admision,
                    schedule : subRoom.room.schedule,
                    careerName : register.curricular.career.name,
                    curricularName : register.curricular.code,
                    moduleName : subM.module.name,
                    courseName : subRoom.courseName,
                    teacherFullName : subRoom.room.teacher?.fullName || "",
                    score : subRoom.score,
            }))
        )
    ))
    return response
}

export async function filterByAdmisionAndCareerId({ admision ,careerId, dateStart , dateEnd } : DtoBodyReport) : Promise<DtoResponseReport[]> {
    const registers = await prisma.register.findMany({
        where : {
            curricular : {
                careerId: careerId,     
            },
            student:{
                admision: admision,
            },
            subscriptionsModule : {
                some : {
                    subscriptionsRoom : {
                        some : {
                            room :{
                                dateStart : {
                                    gte : new Date(dateStart)
                                },
                                dateEnd : {
                                    lte : new Date(dateEnd)
                                }
                            }
                        }
                    }
                }
            }
        },
        include : {
            curricular : {
                include : {
                    career : true
                }
            },
            student : true,
            subscriptionsModule : {
                include : {
                    module : true,
                    subscriptionsRoom : {
                        include : {
                            room : {
                                include : {
                                    teacher : true
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    let response : DtoResponseReport[] = []
    registers.forEach(register => (
        register.subscriptionsModule.forEach( subM =>
            subM.subscriptionsRoom.forEach(subRoom => response.push({
                    studentFullName : register.student.fullName,
                    admision : register.student.admision,
                    schedule : subRoom.room.schedule,
                    careerName : register.curricular.career.name,
                    curricularName : register.curricular.code,
                    moduleName : subM.module.name,
                    courseName : subRoom.courseName,
                    teacherFullName : subRoom.room.teacher?.fullName || "",
                    score : subRoom.score,
            }))
        )
    ))
    return response
}

export async function filterByCarrerIdAndCurricularId({ curricularId, careerId , dateStart , dateEnd } : DtoBodyReport) : Promise<DtoResponseReport[]> {
    const registers = await prisma.register.findMany({
        where : {
            curricular: {
                id: curricularId,
                careerId: careerId
            },
            subscriptionsModule : {
                some : {
                    subscriptionsRoom : {
                        some : {
                            room :{
                                dateStart : {
                                    gte : new Date(dateStart)
                                },
                                dateEnd : {
                                    lte : new Date(dateEnd)
                                }
                            }
                        }
                    }
                }
            }
        },
        include : {
            curricular : {
                include : {
                    career : true
                }
            },
            student : true,
            subscriptionsModule : {
                include : {
                    module : true,
                    subscriptionsRoom : {
                        include : {
                            room : {
                                include : {
                                    teacher : true
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    let response : DtoResponseReport[] = []
    registers.forEach(register => (
        register.subscriptionsModule.forEach( subM =>
            subM.subscriptionsRoom.forEach(subRoom => response.push({
                    studentFullName : register.student.fullName,
                    admision : register.student.admision,
                    schedule : subRoom.room.schedule,
                    careerName : register.curricular.career.name,
                    curricularName : register.curricular.code,
                    moduleName : subM.module.name,
                    courseName : subRoom.courseName,
                    teacherFullName : subRoom.room.teacher?.fullName || "",
                    score : subRoom.score,
            }))
        )
    ))
    return response
}