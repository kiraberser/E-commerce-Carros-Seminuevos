# Maya's Garage

Plataforma de e-commerce para compra y venta de autos seminuevos en Veracruz, México.

## Stack

- **Frontend:** Next.js 16 · React 19 · TypeScript · Tailwind v4
- **Backend:** Django 6 · Django REST Framework · PostgreSQL
- **Auth:** JWT con refresh token en httpOnly cookie
- **Deploy:** Railway (backend) · Vercel (frontend)

## Estructura

```
MayasGarage/
├── backend/               # Django REST API
└── frontendmayasgarage/   # Next.js App
```

## Funcionalidades

- Catálogo con filtros y búsqueda en vivo
- Detalle de vehículo con galería, specs y comentarios
- Carrito y proceso de checkout en 3 pasos
- Reserva de vehículos
- Landing de venta con formulario de cotización
- Panel de administración con CRUD de vehículos

## Inicio Rápido

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontendmayasgarage
pnpm install
pnpm dev
```

Configura las variables de entorno según los archivos `.env.example` antes de correr el proyecto.
