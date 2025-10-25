# Andreani Autoload — Shopify Automator (v5.4)

Listo para vender e instalar a clientes (Next.js).

## Desarrollo local
```bash
npm install
cp .env.example .env   # rellenar dominio/token
npm run dev
```
Abrí: http://localhost:3000/dashboard

## Producción (Vercel — recomendado)
1. Subí este repo a GitHub.
2. En Vercel: **New Project → Import** tu repo.
3. **Framework:** Next.js (auto).
4. **Build Command:** `next build` • **Output:** `.next`
5. **Environment Variables** (Settings → Environment Variables):
   - `SHOPIFY_DOMAIN` = `tu-tienda.myshopify.com`
   - `SHOPIFY_TOKEN` = `shpat_...`
   - Defaults opcionales: `DEFAULT_DNI`, `DEFAULT_PESO_GR`, etc.
6. Deploy. URL pública: `https://tusubdominio.vercel.app`

> Podés reemplazar la plantilla Andreani desde el panel (se guarda como `/public/andreani.xlsx`).

## Permisos Shopify necesarios
`read_orders`, `read_customers`, `read_fulfillments`, `read_assigned_fulfillment_orders`

## Seguridad
- En producción, preferí **variables de entorno** (no guardes token en archivo).
- HTTPS provisto por Vercel/Render.
