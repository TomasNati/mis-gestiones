import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';

const USERNAME = process.env.BASIC_AUTH_USERNAME;
const PASSWORD = process.env.BASIC_AUTH_PASSWORD;

export function proxy(req: NextRequest) {
  if (!USERNAME || !PASSWORD) {
    console.warn('BASIC_AUTH_USERNAME / BASIC_AUTH_PASSWORD not configured; denying access.');
    return unauthorized();
  }

  const authHeader = req.headers.get('authorization');
  const expected = 'Basic ' + Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

  if (authHeader && safeEqual(authHeader, expected)) {
    return NextResponse.next();
  }

  return unauthorized();
}

function unauthorized() {
  const res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  res.headers.set('WWW-Authenticate', 'Basic realm="Mis gestiones", charset="UTF-8"');
  return res;
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
