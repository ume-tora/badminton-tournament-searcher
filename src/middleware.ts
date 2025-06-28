import { NextRequest, NextResponse } from 'next/server'

const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

const RATE_LIMIT_MAX_REQUESTS = 100
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown'
  const now = Date.now()
  
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const userLimit = rateLimitMap.get(ip) ?? { count: 0, lastReset: now }
    
    if (now - userLimit.lastReset > RATE_LIMIT_WINDOW_MS) {
      userLimit.count = 0
      userLimit.lastReset = now
    }
    
    if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
    
    userLimit.count++
    rateLimitMap.set(ip, userLimit)
  }

  const response = NextResponse.next()
  
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  if (request.nextUrl.protocol === 'http:' && process.env.NODE_ENV === 'production') {
    return NextResponse.redirect(`https://${request.nextUrl.host}${request.nextUrl.pathname}${request.nextUrl.search}`)
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}