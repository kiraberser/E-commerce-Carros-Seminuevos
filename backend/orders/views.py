from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Order
from .serializers import OrderCreateSerializer, OrderSerializer


class OrderListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all().select_related('buyer', 'vehicle')
        return Order.objects.filter(buyer=user).select_related('buyer', 'vehicle')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return OrderCreateSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        vehicle = serializer.validated_data['vehicle']
        order = serializer.save(buyer=request.user)
        # Mark vehicle as unavailable once an order is placed
        vehicle.is_available = False
        vehicle.save(update_fields=['is_available'])
        return Response(OrderSerializer(order, context={'request': request}).data, status=status.HTTP_201_CREATED)


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.all().select_related('buyer', 'vehicle')

    def get_object(self):
        obj = super().get_object()
        if obj.buyer != self.request.user and not self.request.user.is_staff:
            raise PermissionDenied('You do not have permission to view this order.')
        return obj
