
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const prisma = new PrismaClient()

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function register(req, res) {
  const parsed = RegisterSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json(parsed.error.flatten())
  const { name, email, password } = parsed.data
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return res.status(409).json({ error: 'Email já cadastrado' })
  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { name, email, passwordHash: hash, role: 'CITIZEN' } })
  return res.status(201).json({ id: user.id, name: user.name, email: user.email })
}

const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(6) })

export async function login(req, res) {
  const parsed = LoginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json(parsed.error.flatten())
  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' })
  const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' })
  return res.json({ token })
}

export async function me(req, res) {
  return res.json({ user: req.user })
}
