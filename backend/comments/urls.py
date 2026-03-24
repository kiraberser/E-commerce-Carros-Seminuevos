from django.urls import path

from .views import CommentDestroyView, VehicleCommentsView

urlpatterns = [
    path('vehicles/<int:vehicle_id>/comments/', VehicleCommentsView.as_view(), name='vehicle-comments'),
    path('comments/<int:pk>/', CommentDestroyView.as_view(), name='comment-delete'),
]
