"""
Run with:  py manage.py shell < seed_vehicles.py
"""
from vehicles.models import Vehicle

vehicles_data = [
    {
        "make": "Chevrolet",
        "model": "Aveo LS",
        "year": 2024,
        "price": "249000.00",
        "mileage": 31222,
        "transmission": "manual",
        "fuel_type": "gasoline",
        "condition": "excellent",
        "engine": "1.5L 4cil",
        "color": "Blanco",
        "doors": 4,
        "description": "Sedán económico, servicios de agencia, aire acondicionado y frenos ABS.",
        "is_negotiable": False,
        "is_available": True,
    },
    {
        "make": "Nissan",
        "model": "Versa Sr",
        "year": 2024,
        "price": "330000.00",
        "mileage": 28900,
        "transmission": "automatic",
        "fuel_type": "gasoline",
        "condition": "excellent",
        "engine": "1.6L 4cil",
        "color": "Rojo",
        "doors": 4,
        "description": "Versión deportiva con rines de aluminio, pantalla táctil y cámara de reversa.",
        "is_negotiable": False,
        "is_available": True,
    },
    {
        "make": "Toyota",
        "model": "Highlander HEV",
        "year": 2023,
        "price": "799990.00",
        "mileage": 25300,
        "transmission": "automatic",
        "fuel_type": "hybrid",
        "condition": "excellent",
        "engine": "2.5L + Eléctrico",
        "color": "Blanco",
        "doors": 5,
        "description": "SUV premium híbrida, ahorro de combustible superior y 3 filas de asientos.",
        "is_negotiable": False,
        "is_available": True,
    },
    {
        "make": "Volkswagen",
        "model": "Jetta Sportline",
        "year": 2015,
        "price": "190000.00",
        "mileage": 0,          # Pendiente — completar desde el Dashboard
        "transmission": "",     # Pendiente
        "fuel_type": "",        # Pendiente
        "condition": "",        # Pendiente
        "engine": "",           # Pendiente
        "color": "",            # Pendiente
        "doors": None,          # Pendiente
        "description": "",      # Pendiente
        "is_negotiable": False,
        "is_available": True,
    },
]

created = 0
skipped = 0

for data in vehicles_data:
    exists = Vehicle.objects.filter(make=data["make"], model=data["model"], year=data["year"]).exists()
    if exists:
        print(f"  SKIP  {data['year']} {data['make']} {data['model']} (ya existe)")
        skipped += 1
        continue

    Vehicle.objects.create(**data)
    print(f"  OK    {data['year']} {data['make']} {data['model']}")
    created += 1

print(f"\nDone: {created} creados, {skipped} omitidos.")
