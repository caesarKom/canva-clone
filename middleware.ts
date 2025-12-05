import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const FORBIDDEN = [
  '216.158.232.43', 'sex.sh', 'kal.tar.gz', 'xmrig',
  'wget http', 'curl http', 'import("http', "import('http",
  'eval(', 'child_process', 'execSync', 'spawn(', 'vm.run', 'Function(',
];

const DANGER_EXT = ['.sh', '.js', '.tar.gz', '.exe', '.bat'];

function isExternal(u: string): boolean {
  return u.startsWith('http') && !u.startsWith(process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.iscode.eu');
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const url  = req.nextUrl.searchParams.get('url') || '';

  // 1.external images in /_next/image
  if (path === '/_next/image' && isExternal(url)) {
    console.warn('[MW] blocked external image:', url);
    return new NextResponse('External images forbidden', { status: 403 });
  }

  // 2. download the body as a string (we clone the stream so as not to spoil the original)
  let bodyStr = '';
  if (req.body) {
    try {
      bodyStr = JSON.stringify(req.body);
    } catch {
      bodyStr = '';
    }
  }
  const combined = (url + bodyStr + JSON.stringify(req.headers)).toLowerCase();

  // 3. forbidden thongs (RCE)
  for (const bad of FORBIDDEN) {
    if (combined.includes(bad.toLowerCase())) {
      console.warn('[MW] blocked payload:', bad);
      return new NextResponse('Blocked by security policy', { status: 403 });
    }
  }

  // 4. file extensions in uploads
  const disposition = req.headers.get('content-disposition') || '';
  for (const ext of DANGER_EXT) {
    if (disposition.includes(ext) || bodyStr.includes(ext)) {
      console.warn('[MW] blocked file type:', ext);
      return new NextResponse('File type blocked', { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico).*)'],
};