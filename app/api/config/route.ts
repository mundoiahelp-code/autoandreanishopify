import { NextResponse } from 'next/server'
import fs from 'fs'; import path from 'path'
export const runtime='nodejs'; export const dynamic='force-dynamic'
const DATA=path.join(process.cwd(),'data'); const FILE=path.join(DATA,'config.json')
function load(){ if(!fs.existsSync(DATA)) fs.mkdirSync(DATA,{recursive:true}); if(!fs.existsSync(FILE)){ const cfg={ shopifyDomain: process.env.SHOPIFY_DOMAIN||'', shopifyToken: process.env.SHOPIFY_TOKEN||'', defaults:{ dni: process.env.DEFAULT_DNI||'11111111', peso_gr:Number(process.env.DEFAULT_PESO_GR||1000), alto_cm:Number(process.env.DEFAULT_ALTO_CM||1), ancho_cm:Number(process.env.DEFAULT_ANCHO_CM||1), profundidad_cm:Number(process.env.DEFAULT_PROFUNDIDAD_CM||1), valor_declarado:Number(process.env.DEFAULT_VALOR_DECLARADO||6000) } }; fs.writeFileSync(FILE, JSON.stringify(cfg,null,2),'utf8'); return cfg } return JSON.parse(fs.readFileSync(FILE,'utf8')) }
export async function GET(){ return NextResponse.json(load()) }
export async function POST(req:Request){ const body=await req.json(); if(!fs.existsSync(DATA)) fs.mkdirSync(DATA,{recursive:true}); fs.writeFileSync(FILE, JSON.stringify(body,null,2),'utf8'); return new NextResponse('OK') }
