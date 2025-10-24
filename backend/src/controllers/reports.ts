
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const CreateReportSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  category: z.enum(['FALTA_AGUA','VAZAMENTO','QUALIDADE','OUTROS']),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  address: z.string().optional(),
  images: z.array(z.string()).optional()
})

export async function createReport(req, res) {
  const parsed = CreateReportSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json(parsed.error.flatten())
  const { title, description, category, lat, lng, address, images } = parsed.data
  const report = await prisma.report.create({
    data: {
      title, description, category, lat, lng, address,
      status: 'ABERTA',
      userId: req.user.id,
      imagesJson: images ? JSON.stringify(images) : null
    }
  })
  res.status(201).json(report)
}

export async function createReportWithUpload(req, res) {
  const files = (req.files || [])
  const images = Array.isArray(files) ? files.map(f => `/uploads/${f.filename}`) : []

  const parsed = CreateReportSchema.omit({ images: true }).safeParse(req.body)
  if (!parsed.success) return res.status(400).json(parsed.error.flatten())
  const { title, description, category, lat, lng, address } = parsed.data
  const report = await prisma.report.create({
    data: {
      title, description, category, lat: Number(lat), lng: Number(lng), address,
      status: 'ABERTA',
      userId: req.user.id,
      imagesJson: images.length ? JSON.stringify(images) : null
    }
  })
  return res.status(201).json(report)
}

export async function listReports(req, res) {
  const page = Math.max(1, Number(req.query.page) || 1)
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 20))
  const { status, category, q, startDate, endDate } = req.query

  const createdAt = (() => {
    if (!startDate && !endDate) return undefined
    const gte = startDate ? new Date(String(startDate)) : undefined
    const lte = endDate ? new Date(String(endDate)) : undefined
    return { gte, lte }
  })()

  const where:any = {
    status: status || undefined,
    category: category || undefined,
    createdAt,
    OR: q ? [
      { title: { contains: q as string, mode: 'insensitive' } },
      { description: { contains: q as string, mode: 'insensitive' } }
    ] : undefined
  }

  // Filtro por raio (bounding box + haversine)
  const centerLat = req.query.centerLat != null ? Number(req.query.centerLat) : undefined
  const centerLng = req.query.centerLng != null ? Number(req.query.centerLng) : undefined
  const radiusKm  = req.query.radiusKm  != null ? Number(req.query.radiusKm)  : undefined

  if (centerLat != null && centerLng != null && radiusKm != null) {
    const latDelta = radiusKm / 111
    const lngDelta = radiusKm / (111 * Math.cos(centerLat * Math.PI / 180))
    where.lat = { gte: centerLat - latDelta, lte: centerLat + latDelta }
    where.lng = { gte: centerLng - lngDelta, lte: centerLng + lngDelta }
  }

  const all = await prisma.report.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { id: true, name: true } } }
  })

  function haversineKm(lat1:number, lon1:number, lat2:number, lon2:number){
    const R = 6371
    const dLat = (lat2-lat1)*Math.PI/180
    const dLon = (lon2-lon1)*Math.PI/180
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2
    return 2*R*Math.asin(Math.sqrt(a))
  }

  let filtered = all
  if (centerLat != null && centerLng != null && radiusKm != null) {
    filtered = all.filter(r => haversineKm(centerLat, centerLng, r.lat, r.lng) <= radiusKm)
  }

  const total = filtered.length
  const start = (page-1)*pageSize
  const pageData = filtered.slice(start, start + pageSize)
  res.json({ data: pageData, total, page, pageSize })
}

export async function getReport(req, res) {
  const id = Number(req.params.id)
  const report = await prisma.report.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true } }, comments: { include: { user: { select: { id: true, name: true, role: true } } }, orderBy: { createdAt: 'asc' } } }
  })
  if (!report) return res.status(404).json({ error: 'Não encontrada' })
  res.json(report)
}

const UpdateStatusSchema = z.object({ status: z.enum(['ABERTA','EM_ANALISE','RESOLVIDA','REJEITADA']) })
export async function updateStatus(req, res) {
  const id = Number(req.params.id)
  const parsed = UpdateStatusSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json(parsed.error.flatten())
  const report = await prisma.report.update({ where: { id }, data: { status: parsed.data.status } })
  res.json(report)
}
