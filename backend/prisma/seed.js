
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding...')

  // Admin
  const adminEmail = 'admin@demo.com'
  const adminPass = 'admin123'
  const adminHash = await bcrypt.hash(adminPass, 10)
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { name: 'Administrador', email: adminEmail, passwordHash: adminHash, role: 'ADMIN' }
  })

  // Cidadãos
  const usersData = [
    { name: 'João Silva', email: 'joao@demo.com' },
    { name: 'Maria Souza', email: 'maria@demo.com' },
    { name: 'Carlos Lima', email: 'carlos@demo.com' }
  ]
  for (const u of usersData) {
    const hash = await bcrypt.hash('senha123', 10)
    await prisma.user.upsert({ where: { email: u.email }, update: {}, create: { ...u, passwordHash: hash, role: 'CITIZEN' } })
  }

  // Coordenadas aproximadas de Saquarema
  const base = { lat: -22.92, lng: -42.51 }
  function jitter(n) { return (Math.random() - 0.5) * n }

  const samples = [
    { title: 'Falta de água no bairro', description: 'Sem abastecimento desde cedo.', category: 'FALTA_AGUA', status: 'ABERTA' },
    { title: 'Vazamento na calçada', description: 'Vazamento visível na rua.', category: 'VAZAMENTO', status: 'EM_ANALISE' },
    { title: 'Água com cor estranha', description: 'Água amarelada na torneira.', category: 'QUALIDADE', status: 'ABERTA' },
    { title: 'Pressão muito baixa', description: 'Quase não sai água.', category: 'FALTA_AGUA', status: 'RESOLVIDA' },
    { title: 'Vazamento próximo à escola', description: 'Grande poça d’água se formando.', category: 'VAZAMENTO', status: 'REJEITADA' },
  ]

  const users = await prisma.user.findMany({ where: { role: 'CITIZEN' } })

  for (const s of samples) {
    const lat = base.lat + jitter(0.05)
    const lng = base.lng + jitter(0.05)
    const user = users[Math.floor(Math.random() * users.length)]
    await prisma.report.create({ data: { title: s.title, description: s.description, category: s.category, status: s.status, lat, lng, userId: user.id } })
  }

  console.log('Seed finalizado')
}

main().then(()=>prisma.$disconnect()).catch(async (e)=>{ console.error(e); await prisma.$disconnect(); process.exit(1) })
