import './globals.css'
import React from 'react'

export const metadata = { title: 'Andreani Autoload — Shopify Automator' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="container">
          <header className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="h1">Andreani Autoload</h1>
              <p className="helper">Exportá pedidos de Shopify a la planilla oficial de Andreani — rápido y sin errores.</p>
            </div>
            <span className="badge">v5.4 • Production-ready</span>
          </header>
          {children}
          <footer className="mt-10 text-center helper">© {new Date().getFullYear()} • Listo para vender y desplegar</footer>
        </div>
      </body>
    </html>
  )
}
