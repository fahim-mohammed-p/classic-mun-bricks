from django.urls import path
from .views import ContactEnquiryCreateView

urlpatterns = [
    path('enquiries/', ContactEnquiryCreateView.as_view(), name='contact-enquiry-create'),
]
