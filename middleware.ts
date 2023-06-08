import { getToken } from 'next-auth/jwt'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
    const token = await getToken({ req, secret: 'soygotto' })
    const { pathname } = req.nextUrl
    // if(pathname.startsWith("/api") || pathname.startsWith("/app")){
    if(pathname.startsWith("/app")){

        if(pathname.startsWith("/api/auth")){
            return NextResponse.next()
        }
        // console.log("TOKEN",token)//pathname.starWith("app/admin") => isAdmin(token)
        if(token){
            return NextResponse.next()
        }

        const urlLogin = req.nextUrl.clone()
        urlLogin.pathname = '/'
        return NextResponse.redirect(urlLogin)
    }
}
