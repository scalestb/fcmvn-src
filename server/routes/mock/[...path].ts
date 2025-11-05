// Fallback: /mock/** -> đọc file /public/mock/**.json
import { defineEventHandler, getRouterParam, createError } from 'h3'
import { promises as fsp } from 'node:fs'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'path') || ''
  const rel = String(slug).split('/').filter(Boolean).join('/')          // tactics/meta -> tactics/meta
  const file = join(process.cwd(), 'public', 'mock', rel)       // .../public/mock/tactics/meta.json

  try {
    const buf = await fsp.readFile(file, 'utf8')
    event.node.res.setHeader('Content-Type', 'application/json; charset=utf-8')
    return buf
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: `Mock not found: /mock/${rel}`,
      data: { file }
    })
  }
})
