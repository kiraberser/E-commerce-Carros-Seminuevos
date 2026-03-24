from django.contrib import admin

from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'buyer', 'vehicle', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('buyer__email', 'vehicle__make', 'vehicle__model')
    raw_id_fields = ('buyer', 'vehicle')
