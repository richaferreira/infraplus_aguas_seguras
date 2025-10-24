
import { Router } from 'express'
import { authRouter } from './auth.js'
import { reportsRouter } from './reports.js'
import { commentsRouter } from './comments.js'
import { statsRouter } from './stats.js'

export const router = Router()
router.use('/auth', authRouter)
router.use('/reports', reportsRouter)
router.use('/comments', commentsRouter)
router.use('/stats', statsRouter)
