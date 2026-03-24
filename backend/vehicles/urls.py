from django.urls import path

from .views import ReservationListView, ReserveVehicleView, VehicleDetailView, VehicleImageDestroyView, VehicleListCreateView

urlpatterns = [
    path('vehicles/', VehicleListCreateView.as_view(), name='vehicle-list'),
    path('vehicles/<int:pk>/', VehicleDetailView.as_view(), name='vehicle-detail'),
    path('vehicles/<int:pk>/reserve/', ReserveVehicleView.as_view(), name='vehicle-reserve'),
    path('vehicles/images/<int:pk>/', VehicleImageDestroyView.as_view(), name='vehicle-image-destroy'),
    path('reservations/', ReservationListView.as_view(), name='reservation-list'),
]
