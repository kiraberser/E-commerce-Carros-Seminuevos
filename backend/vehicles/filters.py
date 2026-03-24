import django_filters

from .models import Vehicle


class VehicleFilter(django_filters.FilterSet):
    make = django_filters.CharFilter(lookup_expr='icontains')
    model = django_filters.CharFilter(lookup_expr='icontains')
    price_min = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    year_min = django_filters.NumberFilter(field_name='year', lookup_expr='gte')
    year_max = django_filters.NumberFilter(field_name='year', lookup_expr='lte')
    mileage_max = django_filters.NumberFilter(field_name='mileage', lookup_expr='lte')
    fuel_type = django_filters.CharFilter(lookup_expr='iexact')
    transmission = django_filters.CharFilter(lookup_expr='iexact')
    condition = django_filters.CharFilter(lookup_expr='iexact')
    is_available = django_filters.BooleanFilter()
    is_reserved = django_filters.BooleanFilter()

    class Meta:
        model = Vehicle
        fields = [
            'make', 'model', 'price_min', 'price_max',
            'year_min', 'year_max', 'mileage_max',
            'fuel_type', 'transmission', 'condition',
            'is_available', 'is_reserved',
        ]
