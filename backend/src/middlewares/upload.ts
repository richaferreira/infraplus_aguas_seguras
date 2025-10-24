
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const uploadDir = path.resolve(process.cwd(), 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ts = Date.now()
    const ext = path.extname(file.originalname) || '.jpg'
    cb(null, `${ts}-${Math.round(Math.random()*1e9)}${ext}`)
  }
})

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
})
