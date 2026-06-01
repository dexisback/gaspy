import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaNeonHttp } from '@prisma/adapter-neon'

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL as string, {})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Creating TestItem...')
  const item = await prisma.testItem.create({ data: { title: 'script-seed', content: 'seed from script' } })
  console.log('Created:', item)
  const all = await prisma.testItem.findMany({ orderBy: { id: 'asc' } })
  console.log('All items:', all)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
