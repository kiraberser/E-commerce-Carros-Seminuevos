from django.contrib import admin

from .models import Vehicle, VehicleImage


class VehicleImageInline(admin.TabularInline):
    model = VehicleImage
    extra = 1


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('make', 'model', 'year', 'price', 'mileage', 'is_available', 'is_reserved')
    list_filter = ('is_available', 'is_reserved', 'fuel_type', 'transmission', 'condition')
    search_fields = ('make', 'model', 'description')
    inlines = [VehicleImageInline]
