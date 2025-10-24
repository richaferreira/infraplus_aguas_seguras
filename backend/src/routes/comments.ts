
import { Router } from 'express'
import { auth } from '../middlewares/auth.js'
import { addComment } from '../controllers/comments.js'

export const commentsRouter = Router()
commentsRouter.post('/', auth(), addComment)
