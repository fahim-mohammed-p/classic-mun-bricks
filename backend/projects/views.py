from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import ProjectLocation
from .serializers import ProjectLocationSerializer


class ProjectLocationListView(generics.ListAPIView):
    """
    Public API endpoint returning all active Classic Mun Bricks project locations
    for dynamic rendering on the Project Route map.
    """
    serializer_class = ProjectLocationSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        return (
            ProjectLocation.objects.filter(is_active=True)
            .select_related('district__state')
            .prefetch_related('images')
            .order_by('order', 'district__name')
        )
