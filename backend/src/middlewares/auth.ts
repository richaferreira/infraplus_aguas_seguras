
import jwt from 'jsonwebtoken'

export function auth(requiredRole = null) {
  return (req, res, next) => {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ error: 'Token ausente' })
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      req.user = payload
      if (requiredRole && payload.role !== requiredRole) return res.status(403).json({ error: 'Proibido' })
      next()
    } catch (e) {
      return res.status(401).json({ error: 'Token inválido' })
    }
  }
}
