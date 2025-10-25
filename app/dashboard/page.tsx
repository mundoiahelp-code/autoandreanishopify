'use client'
import { useEffect, useState } from 'react'

type Cfg = {
  shopifyDomain: string
  shopifyToken: string
  defaults: { dni: string; peso_gr: number; alto_cm: number; ancho_cm: number; profundidad_cm: number; valor_declarado: number }
}

export default function Dashboard(){
  const [cfg,setCfg]=useState<Cfg|null>(null)
  const [msg,setMsg]=useState(''); const [err,setErr]=useState(''); const [busy,setBusy]=useState(false); const [ordersCount,setOrdersCount]=useState<number|null>(null)
  const [tplMsg,setTplMsg]=useState(''); const [logs,setLogs]=useState<string[]>([])

  useEffect(()=>{(async()=>{const r=await fetch('/api/config'); if(r.ok) setCfg(await r.json())})()},[])
  const norm=(d:string)=>d.replace(/^https?:\/\//i,'').replace(/\/+$/,'').trim()
  const log = (l:string)=> setLogs(prev=>[l,...prev].slice(0,10))

  async function save(){ if(!cfg) return; setBusy(true); setMsg(''); setErr('')
    const r=await fetch('/api/config',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...cfg,shopifyDomain:norm(cfg.shopifyDomain)})})
    setBusy(false); r.ok?setMsg('Guardado ✅'):setErr('Error al guardar')
  }

  async function test(){ setBusy(true); setMsg(''); setErr(''); setOrdersCount(null)
    const r=await fetch('/api/test'); setBusy(false)
    if(!r.ok){ const t=await r.text(); setErr(t); log('❌ Test: '+t); return }
    const d=await r.json(); setOrdersCount(d.count??0); setMsg(d.message||'Conexión OK'); log('✅ Test OK — pedidos: '+(d.count??0))
  }

  async function generate(){ setBusy(true); setMsg(''); setErr(''); setOrdersCount(null)
    const r=await fetch('/api/generate',{method:'POST'}); setBusy(false)
    if(!r.ok){ const t=await r.text(); setErr(t); log('❌ Generar: '+t); return }
    const blob=await r.blob(); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url
    const d=new Date(); const dd=String(d.getDate()).padStart(2,'0'), mm=String(d.getMonth()+1).padStart(2,'0'), yyyy=d.getFullYear()
    a.download=`andreani_envios_${dd}-${mm}-${yyyy}.xlsx`; a.click(); URL.revokeObjectURL(url); setMsg('Archivo descargado ✅'); log('✅ Excel descargado')
  }

  async function uploadTemplate(file: File){
    setTplMsg(''); setErr(''); setMsg('')
    const fd=new FormData(); fd.set('file',file)
    const r=await fetch('/api/template',{method:'POST',body:fd})
    if(r.ok){ setTplMsg('Plantilla actualizada ✅'); log('📄 Plantilla reemplazada') } else { setTplMsg('Error al subir plantilla'); log('❌ Plantilla: error') }
  }

  if(!cfg) return <p>Cargando…</p>

  return (<main className="grid gap-6">
    <section className="card grid gap-4">
      <h2 className="h2">Credenciales Shopify</h2>
      <div className="grid md:grid-cols-2 gap-3">
        <label className="grid gap-1"><span className="label">Shopify Domain</span><input className="input" value={cfg.shopifyDomain} onChange={e=>setCfg({...cfg, shopifyDomain:e.target.value})} placeholder="tu-tienda.myshopify.com"/><span className="helper">Sin https:// y sin / al final</span></label>
        <label className="grid gap-1"><span className="label">Access Token</span><input className="input" value={cfg.shopifyToken} onChange={e=>setCfg({...cfg, shopifyToken:e.target.value})} placeholder="shpat_..."/><span className="helper">Admin API access token</span></label>
      </div>
    </section>

    <section className="card grid gap-4">
      <h2 className="h2">Plantilla Andreani</h2>
      <p className="helper">Subí la plantilla oficial (XLSX). Se guardará como <code>/public/andreani.xlsx</code>. Si la hoja “Configuración” está oculta, igual la usamos.</p>
      <input type="file" accept=".xlsx" onChange={(e)=>{ if(e.target.files?.[0]) uploadTemplate(e.target.files[0]) }} />
      {tplMsg && <div className="alert alert-ok">{tplMsg}</div>}
    </section>

    <section className="card grid gap-4">
      <h2 className="h2">Valores por defecto</h2>
      <div className="grid md:grid-cols-3 gap-3">
        <label className="grid gap-1"><span className="label">DNI</span><input className="input" value={cfg.defaults.dni} onChange={e=>setCfg({...cfg, defaults:{...cfg.defaults, dni:e.target.value}})}/></label>
        <label className="grid gap-1"><span className="label">Peso (gr)</span><input className="input" type="number" value={cfg.defaults.peso_gr} onChange={e=>setCfg({...cfg, defaults:{...cfg.defaults, peso_gr:Number(e.target.value)}})}/></label>
        <label className="grid gap-1"><span className="label">Alto (cm)</span><input className="input" type="number" value={cfg.defaults.alto_cm} onChange={e=>setCfg({...cfg, defaults:{...cfg.defaults, alto_cm:Number(e.target.value)}})}/></label>
        <label className="grid gap-1"><span className="label">Ancho (cm)</span><input className="input" type="number" value={cfg.defaults.ancho_cm} onChange={e=>setCfg({...cfg, defaults:{...cfg.defaults, ancho_cm:Number(e.target.value)}})}/></label>
        <label className="grid gap-1"><span className="label">Profundidad (cm)</span><input className="input" type="number" value={cfg.defaults.profundidad_cm} onChange={e=>setCfg({...cfg, defaults:{...cfg.defaults, profundidad_cm:Number(e.target.value)}})}/></label>
        <label className="grid gap-1"><span className="label">Valor declarado ($)</span><input className="input" type="number" value={cfg.defaults.valor_declarado} onChange={e=>setCfg({...cfg, defaults:{...cfg.defaults, valor_declarado:Number(e.target.value)}})}/></label>
      </div>
      <div className="flex flex-wrap gap-3">
        <button className="btn btn-primary" onClick={save} disabled={busy}>Guardar</button>
        <button className="btn btn-ghost" onClick={test} disabled={busy}>Probar conexión</button>
        <button className="btn btn-success" onClick={generate} disabled={busy}>Generar Excel</button>
        {ordersCount!==null && <span className="badge">Pedidos: {ordersCount}</span>}
      </div>
      {(msg||err) && <div className={err?'alert alert-error':'alert alert-ok'}>{err||msg}</div>}
    </section>

    <section className="card">
      <h2 className="h2 mb-2">Logs</h2>
      <div className="space-y-1">{logs.map((l,i)=>(<div key={i} className="logline">{l}</div>))}</div>
    </section>
  </main>)
}
