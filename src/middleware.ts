// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    //We obtain the session from the token
    const supabase = createMiddlewareSupabaseClient({req, res});
    const {data: {session},} = await supabase.auth.getSession();    //We check for the url
    if(req.url.includes('/signin')){
      if(session){
        return NextResponse.redirect(new URL('/', req.url));
      }
      return res;
    }
    //Check auth condition
    if(session){
      
      return res
    }
    return NextResponse.redirect(new URL('/', req.url))
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*', '/signin/:path*'],
}