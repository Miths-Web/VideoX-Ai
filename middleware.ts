import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return NextResponse.next(); // Koi authentication check nahi karega
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api|assets|icons).*)',
  ],
};
