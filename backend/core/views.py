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


def inspect_storage(request):
    """
    Diagnostic endpoint to inspect storage backend, physical files,
    and ProjectImage records in production without exposing secrets.
    """
    if request.method not in ('GET', 'HEAD'):
        return JsonResponse({"status": "method_not_allowed"}, status=405)

    expected_token = getattr(settings, 'KEEP_ALIVE_TOKEN', '') or os.getenv('KEEP_ALIVE_TOKEN', '').strip()
    if expected_token:
        provided_token = request.headers.get('X-Keep-Alive-Token') or request.META.get('HTTP_X_KEEP_ALIVE_TOKEN', '')
        if not provided_token or not secrets.compare_digest(provided_token.strip(), expected_token):
            return JsonResponse({"status": "forbidden"}, status=403)

    from django.core.files.storage import default_storage
    from projects.models import ProjectImage
    from pathlib import Path

    # Database host domain (safe, no credentials)
    db_conn = connection.settings_dict
    db_host = db_conn.get('HOST', '')
    safe_db_host = '.'.join(db_host.split('.')[-2:]) if '.' in db_host else str(db_host)

    # Storage config
    storage_class = default_storage.__class__.__module__ + '.' + default_storage.__class__.__name__
    media_root = str(settings.MEDIA_ROOT)
    media_url = settings.MEDIA_URL

    # Files on disk in media_root
    disk_files = []
    gallery_dir = Path(settings.MEDIA_ROOT) / 'projects' / 'gallery'
    if gallery_dir.exists():
        disk_files = [f.name for f in gallery_dir.iterdir() if f.is_file()]

    # ProjectImage records
    images_info = []
    for img in ProjectImage.objects.select_related('location__district').all():
        name = getattr(img.image, 'name', '')
        url = ''
        try:
            url = img.image.url
        except Exception as e:
            url = f'Error: {e}'

        storage_exists = False
        try:
            storage_exists = default_storage.exists(name) if name else False
        except Exception:
            pass

        file_on_disk = False
        if name and settings.MEDIA_ROOT:
            file_on_disk = (Path(settings.MEDIA_ROOT) / name).exists()

        images_info.append({
            'id': img.id,
            'location': str(img.location),
            'name': name,
            'url': url,
            'storage_class': img.image.storage.__class__.__module__ + '.' + img.image.storage.__class__.__name__,
            'storage_exists': storage_exists,
            'file_on_disk': file_on_disk,
        })

    # Safe inspection of storage-related environment keys (keys only, zero values)
    env_keys = [k for k in os.environ if any(w in k.upper() for w in ['STORAGE', 'DISK', 'MEDIA', 'RENDER', 'SUPABASE', 'CLOUDINARY', 'AWS', 'S3'])]

    # Common mount points check on Linux/Render
    mount_candidates = ['/data', '/var/data', '/mnt']
    existing_mounts = [m for m in mount_candidates if os.path.exists(m)]

    return JsonResponse({
        'status': 'ok',
        'database_host_domain': safe_db_host,
        'storage_class': storage_class,
        'media_root': media_root,
        'media_url': media_url,
        'gallery_files_on_disk': disk_files,
        'relevant_env_keys': env_keys,
        'existing_mounts': existing_mounts,
        'project_images': images_info,
    })


def run_migrations(request):
    """
    Authenticated internal endpoint to trigger pending Django migrations in production.
    """
    if request.method not in ('GET', 'POST'):
        return JsonResponse({"status": "method_not_allowed"}, status=405)

    expected_token = getattr(settings, 'KEEP_ALIVE_TOKEN', '') or os.getenv('KEEP_ALIVE_TOKEN', '').strip()
    if expected_token:
        provided_token = request.headers.get('X-Keep-Alive-Token') or request.META.get('HTTP_X_KEEP_ALIVE_TOKEN', '')
        if not provided_token or not secrets.compare_digest(provided_token.strip(), expected_token):
            return JsonResponse({"status": "forbidden"}, status=403)

    from django.core.management import call_command
    from io import StringIO
    out = StringIO()
    try:
        call_command('migrate', interactive=False, stdout=out)
        return JsonResponse({"status": "ok", "output": out.getvalue()})
    except Exception as e:
        return JsonResponse({"status": "error", "error": str(e), "output": out.getvalue()}, status=500)


