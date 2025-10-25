import Link from 'next/link'

export default function Home() {
  return (
    <main className="grid gap-6">
      <section className="card grid gap-3">
        <h2 className="h2">¿Qué hace?</h2>
        <p>Lee pedidos pagados/no cumplidos de Shopify y los descarga en la <b>planilla oficial de Andreani</b> con validaciones activas.</p>
        <ul className="list-disc pl-6 text-sm text-slate-700">
          <li>Completa DNI, peso, dimensiones y valor declarado ($6000).</li>
          <li>Provincia/Localidad/CP matcheados a la hoja <i>Configuración</i> aun si está oculta.</li>
          <li>Si falta <b>Número</b> en la dirección: se asigna <b>1</b> automáticamente.</li>
        </ul>
        <Link href="/dashboard" className="btn btn-primary w-max">Ir al Panel</Link>
      </section>
      <section className="card">
        <h2 className="h2 mb-2">Privacidad</h2>
        <p className="text-sm text-slate-700">Los datos se procesan en tu servidor/PC. El token se guarda solo en tu instancia (<code>data/config.json</code> o variables de entorno en producción).</p>
      </section>
    </main>
  )
}
