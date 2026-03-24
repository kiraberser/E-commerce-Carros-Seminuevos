from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

from vehicles.models import Vehicle

from .models import Comment
from .serializers import CommentSerializer


class VehicleCommentsView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Comment.objects.filter(
            vehicle_id=self.kwargs['vehicle_id']
        ).select_related('author')

    def perform_create(self, serializer):
        vehicle = generics.get_object_or_404(Vehicle, pk=self.kwargs['vehicle_id'])
        serializer.save(author=self.request.user, vehicle=vehicle)


class CommentDestroyView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        if instance.author != self.request.user and not self.request.user.is_staff:
            raise PermissionDenied('You cannot delete this comment.')
        instance.delete()
