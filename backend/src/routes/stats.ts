
import { Router } from 'express'
import { summary } from '../controllers/stats.js'

export const statsRouter = Router()
statsRouter.get('/summary', summary)
