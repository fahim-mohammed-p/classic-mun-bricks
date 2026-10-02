import os
import secrets
from django.conf import settings
from django.db import connection
from django.http import JsonResponse


def keep_alive(request):
    """
    Lightweight backend-only keep-alive endpoint for Classic Mun Bricks.
    Executes 'SELECT 1' against the existing database connection to maintain
    activity without touching project tables or modifying data.
    """
    if request.method not in ('GET', 'HEAD'):
        return JsonResponse({"status": "method_not_allowed"}, status=405)

    expected_token = getattr(settings, 'KEEP_ALIVE_TOKEN', '') or os.getenv('KEEP_ALIVE_TOKEN', '').strip()
    if expected_token:
        provided_token = request.headers.get('X-Keep-Alive-Token') or request.META.get('HTTP_X_KEEP_ALIVE_TOKEN', '')
        if not provided_token or not secrets.compare_digest(provided_token.strip(), expected_token):
            return JsonResponse({"status": "forbidden"}, status=403)

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()

        return JsonResponse({"status": "ok"})
    except Exception:
        return JsonResponse(
            {"status": "unavailable"},
            status=503
        )
