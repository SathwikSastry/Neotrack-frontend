import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// This route serves static files from the embedded game's dist folder.
// It reads files from: <repo>/app/game/astro-neo-defense/dist
// Usage: /game/static/index.html -> serves index.html

export const runtime = 'nodejs'

const DIST = path.join(process.cwd(), 'app', 'game', 'astro-neo-defense', 'dist')

function contentTypeFromFile(filePath: string) {
  const ext = path.extname(filePath).toLowerCase()
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8'
    case '.js': return 'application/javascript; charset=utf-8'
    case '.css': return 'text/css; charset=utf-8'
    case '.png': return 'image/png'
    case '.jpg':
    case '.jpeg': return 'image/jpeg'
    case '.svg': return 'image/svg+xml'
    case '.json': return 'application/json'
    case '.wasm': return 'application/wasm'
    case '.map': return 'application/octet-stream'
    case '.ico': return 'image/x-icon'
    case '.woff2': return 'font/woff2'
    case '.woff': return 'font/woff'
    default: return 'application/octet-stream'
  }
}

export async function GET(req: Request, { params }: { params: { path?: string[] } }) {
  try {
    const parts = params?.path || []
    const rel = parts.length ? parts.join('/') : 'index.html'

    // normalize and prevent directory traversal
    const safeRel = path.normalize(rel).replace(/^([\\\/]+)|([\\\/]*\.\.([\\\/]|$))/g, '')
    const abs = path.resolve(DIST, safeRel)

    // ensure the resolved path is inside DIST
    const relToDist = path.relative(DIST, abs)
    if (relToDist.startsWith('..') || path.isAbsolute(relToDist) && relToDist.indexOf('..') === 0) {
      return new NextResponse('Not found', { status: 404 })
    }

    let filePath = abs
    if (!fs.existsSync(filePath)) {
      // fallback: serve index.html for SPA routes
      filePath = path.join(DIST, 'index.html')
      if (!fs.existsSync(filePath)) return new NextResponse('Not found', { status: 404 })
    }

    const data = await fs.promises.readFile(filePath)
    const ct = contentTypeFromFile(filePath)

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': ct,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (e) {
    return new NextResponse('Server error', { status: 500 })
  }
}
