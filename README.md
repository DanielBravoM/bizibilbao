# BiziBilbao 🏙️

**Encuentra tu barrio ideal en Bilbao** — Proyecto Open Data para el Ayuntamiento de Bilbao.

## Stack
- **Frontend**: HTML/CSS/JS vanilla (sin frameworks)
- **Backend**: Node.js + Vercel Serverless Functions
- **Base de datos**: Supabase (PostgreSQL)
- **Datos**: Open Data Bilbao, Eustat, Metro Bilbao GTFS, Mapa Acústico 2023

## Setup local

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Edita .env con tus credenciales de Supabase
```

### 3. Crear tablas en Supabase
Ve a **Supabase → SQL Editor** y ejecuta el contenido de `schema.sql`.

### 4. Cargar datos iniciales
Necesitas la **service_role key** de Supabase (Settings → API → service_role):
```bash
SUPABASE_SERVICE_KEY=tu_service_role_key node scripts/seed.js
```

### 5. Ejecutar en local
```bash
npm run dev   # Arranca Vercel Dev en http://localhost:3000
```

## Deploy en Vercel

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Conectar con tu cuenta
vercel login

# 3. Añadir variables de entorno en Vercel
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY

# 4. Deploy
npm run deploy
```

## API Endpoints

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/api/barrios` | Lista todos los barrios con scores calculados |
| GET | `/api/barrios?verde=5&metro=4&...` | Scores ponderados por criterio (1-5 estrellas) |
| GET | `/api/barrio/:id` | Ficha completa de un barrio |

## Fuentes de datos

| Dato | Fuente |
|------|--------|
| Equipamientos (colegios, ocio, zonas verdes) | [Open Data Bilbao](https://opendata.bilbao.eus) |
| Población y demografía | [Eustat](https://eustat.eus) |
| Paradas de metro | [Metro Bilbao GTFS](https://www.metrobilbao.eus) |
| Nivel de ruido | [Mapa Acústico Bilbao 2023](https://opendata.bilbao.eus) |
| Precio de alquiler | [Eustat – Precio vivienda](https://eustat.eus) |

## Estructura del proyecto

```
bizibilbao/
├── api/
│   ├── barrios.js          # GET /api/barrios?verde=3&metro=4...
│   └── barrio/[id].js      # GET /api/barrio/:id
├── public/
│   └── index.html          # Frontend (HTML/CSS/JS)
├── scripts/
│   └── seed.js             # ETL inicial con datos Open Data Bilbao
├── schema.sql              # Schema de la base de datos Supabase
├── package.json
├── vercel.json
└── .env.example
```
