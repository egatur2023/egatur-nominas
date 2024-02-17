import { PrismaClient } from '@prisma/client'

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined

}

export const prisma =
  global.prisma ||
  new PrismaClient({
    // log: ['query'],s
  })

//   prisma.$on('query', (e) => {
//     console.log('Query: ' + e.query)
//     console.log('Params: ' + e.params)
//     console.log('Duration: ' + e.duration + 'ms')
//   })

// if (process.env.NODE_ENV !== 'production') global.prisma = prisma
global.prisma = prisma
