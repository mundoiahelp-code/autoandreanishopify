import { NextResponse } from 'next/server'
import fs from 'fs'; import path from 'path'
export const runtime='nodejs'; export const dynamic='force-dynamic'
export async function POST(req: Request){
  const form = await req.formData()
  const file = form.get('file') as File | null
  if(!file) return new NextResponse('No se envió archivo', { status: 400 })
  const arrBuf = await file.arrayBuffer()
  const buf = Buffer.from(arrBuf)
  const out = path.join(process.cwd(),'public','andreani.xlsx')
  fs.writeFileSync(out, buf)
  return new NextResponse('OK')
}
