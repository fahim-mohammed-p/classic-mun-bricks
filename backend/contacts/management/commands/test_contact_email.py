import sys
from django.core.management.base import BaseCommand
from django.conf import settings
from django.core.mail import EmailMessage


class Command(BaseCommand):
    help = 'Directly tests the configured SMTP settings (Brevo) by sending a test email to CONTACT_RECEIVER_EMAIL.'

    def handle(self, *args, **options):
        email_backend = getattr(settings, 'EMAIL_BACKEND', '')
        email_host = getattr(settings, 'EMAIL_HOST', '')
        email_port = getattr(settings, 'EMAIL_PORT', '')
        email_use_tls = getattr(settings, 'EMAIL_USE_TLS', False)
        email_host_user = getattr(settings, 'EMAIL_HOST_USER', '')
        email_host_password = getattr(settings, 'EMAIL_HOST_PASSWORD', '')
        default_from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', '')
        contact_receiver_email = getattr(settings, 'CONTACT_RECEIVER_EMAIL', '')

        user_status = "PRESENT" if (email_host_user and email_host_user.strip()) else "MISSING"
        pass_status = "PRESENT" if (email_host_password and email_host_password.strip()) else "MISSING"

        self.stdout.write("DIRECT SMTP TEST")
        self.stdout.write("----------------")
        self.stdout.write(f"EMAIL_BACKEND: {email_backend}")
        self.stdout.write(f"EMAIL_HOST: {email_host}")
        self.stdout.write(f"EMAIL_PORT: {email_port}")
        self.stdout.write(f"EMAIL_USE_TLS: {email_use_tls}")
        self.stdout.write(f"EMAIL_HOST_USER: {user_status}")
        self.stdout.write(f"EMAIL_HOST_PASSWORD: {pass_status}")
        self.stdout.write(f"DEFAULT_FROM_EMAIL: {default_from_email}")
        self.stdout.write(f"CONTACT_RECEIVER_EMAIL: {contact_receiver_email}\n")

        subject = "Classic Mun Bricks SMTP Test"
        body = (
            "Classic Mun Bricks - Direct SMTP Test Email\n\n"
            "This email verifies that Django SMTP settings and Brevo relay "
            "are functioning properly."
        )

        sent_count = None
        error_class = None
        error_msg = None

        try:
            email_msg = EmailMessage(
                subject=subject,
                body=body,
                from_email=default_from_email,
                to=[contact_receiver_email],
            )
            sent_count = email_msg.send(fail_silently=False)
        except Exception as e:
            error_class = e.__class__.__name__
            err_text = str(e)
            if email_host_password and email_host_password in err_text:
                err_text = err_text.replace(email_host_password, "[REDACTED_PASSWORD]")
            error_msg = err_text

        self.stdout.write(f"EMAIL_SEND_RESULT: {sent_count if sent_count is not None else 0}\n")
        
        if sent_count and sent_count > 0:
            self.stdout.write(self.style.SUCCESS("SMTP STATUS:\nSUCCESS\n"))
            self.stdout.write("ERROR CLASS:\nNone\n")
            self.stdout.write("ERROR MESSAGE:\nNone")
        else:
            self.stdout.write(self.style.ERROR("SMTP STATUS:\nFAILED\n"))
            self.stdout.write(f"ERROR CLASS:\n{error_class}\n")
            self.stdout.write(f"ERROR MESSAGE:\n{error_msg}")
            sys.exit(1)
