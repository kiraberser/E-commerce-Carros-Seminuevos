from rest_framework import serializers

from vehicles.serializers import VehicleListSerializer

from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    vehicle_detail = VehicleListSerializer(source='vehicle', read_only=True)
    buyer_email = serializers.EmailField(source='buyer.email', read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'buyer', 'buyer_email', 'vehicle', 'vehicle_detail', 'status', 'notes', 'created_at')
        read_only_fields = ('id', 'buyer', 'buyer_email', 'vehicle_detail', 'status', 'created_at')


class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('vehicle', 'notes')

    def validate_vehicle(self, vehicle):
        if not vehicle.is_available:
            raise serializers.ValidationError('This vehicle is not available for purchase.')
        return vehicle
