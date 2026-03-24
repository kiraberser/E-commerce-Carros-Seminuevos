from rest_framework import serializers

from .models import Vehicle, VehicleImage


class VehicleImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = VehicleImage
        fields = ('id', 'image', 'is_primary', 'order')

    def get_image(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        url = obj.image.url
        return request.build_absolute_uri(url) if request else url


class VehicleListSerializer(serializers.ModelSerializer):
    """Compact serializer for list views."""
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = (
            'id', 'sku', 'make', 'model', 'year', 'price', 'mileage',
            'is_negotiable', 'is_available', 'is_reserved',
            'fuel_type', 'transmission', 'color', 'condition',
            'primary_image', 'created_at',
        )

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if img:
            request = self.context.get('request')
            return request.build_absolute_uri(img.image.url) if request else img.image.url
        return None


class VehicleDetailSerializer(serializers.ModelSerializer):
    """Full serializer for detail views."""
    images = VehicleImageSerializer(many=True, read_only=True)
    reserved_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = (
            'id', 'sku', 'make', 'model', 'year', 'price', 'mileage',
            'description', 'is_negotiable', 'is_available',
            'engine', 'transmission', 'fuel_type', 'color', 'doors', 'condition',
            'is_reserved', 'reserved_by', 'reserved_by_name', 'reserved_at',
            'images', 'created_at', 'updated_at',
        )

    def get_reserved_by_name(self, obj):
        if obj.reserved_by:
            return f'{obj.reserved_by.first_name} {obj.reserved_by.last_name}'.strip() or obj.reserved_by.email
        return None


class VehicleWriteSerializer(serializers.ModelSerializer):
    """Serializer for create/update — handles image upload."""

    class Meta:
        model = Vehicle
        fields = (
            'make', 'model', 'year', 'price', 'mileage',
            'description', 'is_negotiable', 'is_available',
            'engine', 'transmission', 'fuel_type', 'color', 'doors', 'condition',
        )

    def create(self, validated_data):
        vehicle = Vehicle.objects.create(**validated_data)
        self._handle_images(vehicle)
        return vehicle

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        self._handle_images(instance)
        return instance

    def _handle_images(self, vehicle):
        request = self.context.get('request')
        if not request:
            return
        images = request.FILES.getlist('images')
        for idx, img_file in enumerate(images):
            VehicleImage.objects.create(
                vehicle=vehicle,
                image=img_file,
                is_primary=(idx == 0),
                order=idx,
            )
