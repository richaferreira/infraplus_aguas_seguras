
import { Router } from 'express'
import { auth } from '../middlewares/auth.js'
import { upload } from '../middlewares/upload.js'
import { createReport, listReports, getReport, updateStatus, createReportWithUpload } from '../controllers/reports.js'

export const reportsRouter = Router()
reportsRouter.get('/', listReports)
reportsRouter.get('/:id', getReport)
reportsRouter.post('/', auth(), createReport)
reportsRouter.post('/with-upload', auth(), upload.array('images', 5), createReportWithUpload)
reportsRouter.patch('/:id/status', auth('ADMIN'), updateStatus)
