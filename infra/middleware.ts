import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from 'infra/jwt'

type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>

function extractToken(req: NextApiRequest): string | null {
  // 1. tenta pegar do cookie (requisições vindas do browser/página)
  if (req.cookies?.token) {
    return req.cookies.token
  }

  // 2. tenta pegar do Authorization header (chamadas diretas à API)
  const authHeader = req.headers.authorization
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  return null
}

export function withAuth(handler: Handler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = extractToken(req)

      if (!token) {
        return res.status(401).json({ error: 'Missing token' })
      }

      const decoded = verifyToken(token)

      if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' })
      }

      // @ts-ignore — adiciona user ao request
      req.user = decoded

      return handler(req, res)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }
}

export function withRole(...allowedRoles: string[]) {
  return (handler: Handler) => {
    return withAuth(async (req: NextApiRequest, res: NextApiResponse) => {
      // @ts-ignore
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden - insufficient permissions' })
      }
      return handler(req, res)
    })
  }
}