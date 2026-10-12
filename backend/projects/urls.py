from django.urls import path
from .views import ProjectLocationListView

app_name = 'projects'

urlpatterns = [
    path('locations/', ProjectLocationListView.as_view(), name='location_list'),
]
