from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import FactoryProcess, CompanyProfile
from .serializers import FactoryProcessSerializer, CompanyProfileSerializer


class FactoryProcessListView(generics.ListAPIView):
    """
    Read-only public API endpoint returning all active factory processes
    ordered by step_number.
    """
    queryset = FactoryProcess.objects.filter(is_active=True).order_by('step_number')
    serializer_class = FactoryProcessSerializer
    permission_classes = [AllowAny]


class CompanyProfileDetailView(generics.RetrieveAPIView):
    """
    Read-only public API endpoint returning verified company profile & project statistics.
    Returns default static values if no profile exists in database yet.
    """
    serializer_class = CompanyProfileSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        profile = CompanyProfile.objects.filter(is_active=True).first()
        if not profile:
            profile = CompanyProfile.objects.create(
                company_name="Classic Mun Bricks",
                started_year=2006,
                years_experience=20,
                tamil_nadu_projects=1000,
                kerala_projects=1500,
                total_projects=2500,
                is_active=True
            )
        else:
            # Update any existing record to reflect verified numbers
            profile.started_year = 2006
            profile.years_experience = 20
            profile.tamil_nadu_projects = 1000
            profile.kerala_projects = 1500
            profile.total_projects = 2500
            profile.save()
        return profile


