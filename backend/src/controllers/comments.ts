
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const CommentSchema = z.object({ reportId: z.number(), content: z.string().min(1) })

export async function addComment(req, res) {
  const parsed = CommentSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json(parsed.error.flatten())
  const { reportId, content } = parsed.data
  const c = await prisma.comment.create({ data: { reportId, content, userId: req.user.id } })
  res.status(201).json(c)
}
