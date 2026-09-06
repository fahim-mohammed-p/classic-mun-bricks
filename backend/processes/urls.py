from django.urls import path
from .views import FactoryProcessListView, CompanyProfileDetailView

urlpatterns = [
    path('', FactoryProcessListView.as_view(), name='factory-process-list'),
    path('company-profile/', CompanyProfileDetailView.as_view(), name='company-profile-detail'),
]

