import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

const ASSETS = path.join(process.cwd(), 'app', 'game', 'astro-neo-defense', 'dist', 'assets')

function contentTypeFromFile(filePath: string) {
  const ext = path.extname(filePath).toLowerCase()
  switch (ext) {
    case '.js': return 'application/javascript; charset=utf-8'
    case '.css': return 'text/css; charset=utf-8'
    case '.png': return 'image/png'
    case '.jpg':
    case '.jpeg': return 'image/jpeg'
    case '.svg': return 'image/svg+xml'
    case '.json': return 'application/json'
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
    if (!parts.length) return new NextResponse('Not found', { status: 404 })
    const rel = parts.join('/')
    const safeRel = path.normalize(rel).replace(/^([\\\/]+)|([\\\/]*\.\.([\\\/]|$))/g, '')
    const abs = path.resolve(ASSETS, safeRel)

    const relToAssets = path.relative(ASSETS, abs)
    if (relToAssets.startsWith('..')) return new NextResponse('Not found', { status: 404 })
    if (!fs.existsSync(abs)) return new NextResponse('Not found', { status: 404 })

    const data = await fs.promises.readFile(abs)
    const ct = contentTypeFromFile(abs)

    return new NextResponse(data, { status: 200, headers: { 'Content-Type': ct, 'Cache-Control': 'public, max-age=86400' } })
  } catch (e) {
    return new NextResponse('Server error', { status: 500 })
  }
}
