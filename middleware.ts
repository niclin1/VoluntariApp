import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from 'infra/jwt'

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value

    // sem token → redireciona para login
    if (!token) {
        return NextResponse.redirect(new URL('/Login', request.url))
    }

    const decoded = await verifyToken(token)

    // token inválido → redireciona para login
    if (!decoded) {
        return NextResponse.redirect(new URL('/Login', request.url))
    }

    return NextResponse.next()
}


export const config = {
    matcher: ['/Home', '/profile', '/ong', '/vaga', '/form']
}