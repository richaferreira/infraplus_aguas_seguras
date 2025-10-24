
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function summary(_req, res){
  const [total, byStatus, byCategory] = await Promise.all([
    prisma.report.count(),
    prisma.report.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.report.groupBy({ by: ['category'], _count: { _all: true } }),
  ])
  res.json({ total, byStatus, byCategory })
}
