from django.conf import settings
from django.db import models


class Vehicle(models.Model):
    TRANSMISSION_CHOICES = [
        ('manual', 'Manual'),
        ('automatic', 'Automatic'),
        ('cvt', 'CVT'),
    ]
    FUEL_CHOICES = [
        ('gasoline', 'Gasoline'),
        ('diesel', 'Diesel'),
        ('hybrid', 'Hybrid'),
        ('electric', 'Electric'),
    ]
    CONDITION_CHOICES = [
        ('excellent', 'Excellent'),
        ('good', 'Good'),
        ('fair', 'Fair'),
    ]

    # Base fields
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    mileage = models.PositiveIntegerField(help_text='Mileage in kilometers')
    description = models.TextField(blank=True)
    is_negotiable = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)

    # Tech specs
    engine = models.CharField(max_length=100, blank=True)
    transmission = models.CharField(max_length=20, choices=TRANSMISSION_CHOICES, blank=True)
    fuel_type = models.CharField(max_length=20, choices=FUEL_CHOICES, blank=True)
    color = models.CharField(max_length=50, blank=True)
    doors = models.PositiveSmallIntegerField(null=True, blank=True)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, blank=True)

    # Reservation
    is_reserved = models.BooleanField(default=False)
    reserved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='reserved_vehicles',
    )
    reserved_at = models.DateTimeField(null=True, blank=True)

    sku = models.CharField(max_length=30, unique=True, blank=True, null=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.year} {self.make} {self.model}'

    def _generate_sku(self):
        make_part = ''.join(c for c in (self.make or 'XXX') if c.isalpha())[:3].upper()
        trans_map = {'manual': 'M', 'automatic': 'A', 'cvt': 'C'}
        trans_part = trans_map.get(self.transmission or '', 'X')
        return f'MG-{self.year}-{make_part}-{trans_part}-{self.pk:04d}'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.sku:
            self.sku = self._generate_sku()
            type(self).objects.filter(pk=self.pk).update(sku=self.sku)


class VehicleImage(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='images')
    image = models.URLField(max_length=500)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'Image for {self.vehicle} (primary={self.is_primary})'
