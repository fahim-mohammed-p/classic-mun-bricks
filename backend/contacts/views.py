import logging
from django.conf import settings
from django.core.mail import EmailMessage
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle
from .models import ContactEnquiry
from .serializers import ContactEnquirySerializer

logger = logging.getLogger(__name__)


class ContactEnquiryThrottle(AnonRateThrottle):
    scope = 'contact_enquiry'
    rate = '30/hour'


class ContactEnquiryCreateView(generics.CreateAPIView):
    """
    Public API endpoint to submit customer contact enquiries.
    Database-first design: Saves enquiry to database FIRST before attempting Brevo SMTP notification.
    """
    queryset = ContactEnquiry.objects.all()
    serializer_class = ContactEnquirySerializer
    permission_classes = [AllowAny]
    throttle_classes = [ContactEnquiryThrottle]

    def create(self, request, *args, **kwargs):
        # 1. Validate customer input using DRF serializer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # 2. DATABASE FIRST: Store enquiry in database
        enquiry = serializer.save()
        logger.info("[CONTACT] enquiry saved ID: %s", enquiry.id)

        # 3. BREVO SMTP EMAIL NOTIFICATION: Attempt sending email safely
        receiver_email = getattr(settings, 'CONTACT_RECEIVER_EMAIL', 'Classicmbrick@gmail.com')
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'Classic Mun Bricks Website <Classicmbrick@gmail.com>')
        
        # Static subject to prevent header injection
        subject = "New Website Enquiry - Classic Mun Bricks"

        body = (
            f"New Website Enquiry\n\n"
            f"A customer has submitted a new enquiry through the Classic Mun Bricks website.\n\n"
            f"Name: {enquiry.name}\n"
            f"Phone: {enquiry.phone}\n"
            f"Email: {enquiry.email if enquiry.email else 'Not provided'}\n"
            f"Location: {enquiry.location if enquiry.location else 'Not provided'}\n"
            f"Enquiry Type: {enquiry.enquiry_type}\n\n"
            f"Message:\n{enquiry.message}\n"
        )

        reply_to_list = [enquiry.email] if (enquiry.email and enquiry.email.strip()) else None

        logger.info("[CONTACT] attempting SMTP notification for enquiry ID: %s", enquiry.id)

        try:
            email_msg = EmailMessage(
                subject=subject,
                body=body,
                from_email=from_email,
                to=[receiver_email],
                reply_to=reply_to_list
            )
            sent_count = email_msg.send(fail_silently=False)
            if sent_count >= 1:
                logger.info("[CONTACT] SMTP notification sent successfully via Brevo (send_count=%s) for enquiry ID: %s", sent_count, enquiry.id)
            else:
                logger.warning("[CONTACT] SMTP notification returned send count %s for enquiry ID: %s", sent_count, enquiry.id)
        except Exception as e:
            # Safe backend logging without leaking secrets or destroying the stored enquiry
            logger.error("[CONTACT] SMTP notification failed for enquiry ID %s: %s", enquiry.id, str(e))


        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                "success": True,
                "message": "Thank you for reaching out! Our team will contact you shortly."
            },
            status=status.HTTP_201_CREATED,
            headers=headers
        )
