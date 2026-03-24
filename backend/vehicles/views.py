from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .filters import VehicleFilter
from .models import Vehicle, VehicleImage
from .permissions import IsAdminOrReadOnly
from .serializers import (
    VehicleDetailSerializer,
    VehicleListSerializer,
    VehicleWriteSerializer,
)


class VehicleListCreateView(generics.ListCreateAPIView):
    queryset = Vehicle.objects.prefetch_related('images').all()
    permission_classes = [IsAdminOrReadOnly]
    filterset_class = VehicleFilter
    search_fields = ['make', 'model', 'description', 'color']
    ordering_fields = ['price', 'year', 'mileage', 'created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return VehicleWriteSerializer
        return VehicleListSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        vehicle = serializer.save()
        return Response(VehicleDetailSerializer(vehicle, context={'request': request}).data, status=status.HTTP_201_CREATED)


class VehicleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vehicle.objects.prefetch_related('images').all()
    permission_classes = [IsAdminOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return VehicleWriteSerializer
        return VehicleDetailSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial, context={'request': request})
        serializer.is_valid(raise_exception=True)
        vehicle = serializer.save()
        return Response(VehicleDetailSerializer(vehicle, context={'request': request}).data)


class ReserveVehicleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        """Reserve a vehicle for the authenticated user."""
        try:
            vehicle = Vehicle.objects.get(pk=pk)
        except Vehicle.DoesNotExist:
            return Response({'detail': 'Vehicle not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not vehicle.is_available:
            return Response({'detail': 'Vehicle is not available.'}, status=status.HTTP_400_BAD_REQUEST)

        if vehicle.is_reserved:
            return Response({'detail': 'Vehicle is already reserved.'}, status=status.HTTP_400_BAD_REQUEST)

        vehicle.is_reserved = True
        vehicle.reserved_by = request.user
        vehicle.reserved_at = timezone.now()
        vehicle.save()
        return Response(VehicleDetailSerializer(vehicle, context={'request': request}).data)

    def delete(self, request, pk):
        """Cancel a reservation."""
        try:
            vehicle = Vehicle.objects.get(pk=pk)
        except Vehicle.DoesNotExist:
            return Response({'detail': 'Vehicle not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not vehicle.is_reserved:
            return Response({'detail': 'Vehicle is not reserved.'}, status=status.HTTP_400_BAD_REQUEST)

        # Only the reserver or an admin can cancel
        if vehicle.reserved_by != request.user and not request.user.is_staff:
            return Response({'detail': 'Not authorized to cancel this reservation.'}, status=status.HTTP_403_FORBIDDEN)

        vehicle.is_reserved = False
        vehicle.reserved_by = None
        vehicle.reserved_at = None
        vehicle.save()
        return Response(VehicleDetailSerializer(vehicle, context={'request': request}).data)


class VehicleImageDestroyView(generics.DestroyAPIView):
    """Admin only: delete a single vehicle image."""
    queryset = VehicleImage.objects.all()
    permission_classes = [IsAdminUser]

    def perform_destroy(self, instance):
        instance.delete()


class ReservationListView(generics.ListAPIView):
    """Admin-only: list all reserved vehicles."""
    serializer_class = VehicleDetailSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Vehicle.objects.filter(is_reserved=True).select_related('reserved_by').prefetch_related('images')
