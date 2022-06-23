import { PrismaClient } from '@prisma/client'

// declare global{
//     var prisma : PrismaClient;
// }

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

export default prisma;