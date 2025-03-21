import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    // Get session
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Middleware session error:", error)
      return res
    }

    // If there's a session, try to refresh it
    if (session) {
      try {
        const { data: { session: newSession } } = await supabase.auth.refreshSession()
        if (newSession) {
          // Session successfully refreshed
          console.log("Session refreshed for user:", newSession.user.id)
        }
      } catch (refreshError) {
        console.error("Session refresh error:", refreshError)
      }
    }

    return res
  } catch (error) {
    console.error("Middleware error:", error)
    return NextResponse.next()
  }
}

// Specify which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 