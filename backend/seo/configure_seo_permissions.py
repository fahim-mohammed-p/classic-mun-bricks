import os, sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
import django
django.setup()

from django.contrib.auth.models import User, Group, Permission
from django.contrib.contenttypes.models import ContentType

def configure_seo_admin_permissions():
    print("--- Configuring SEO Manager Group & Permissions ---")

    # 1. Create or get 'SEO Manager' group
    group, created = Group.objects.get_or_create(name='SEO Manager')
    if created:
        print("Created new group: 'SEO Manager'")
    else:
        print("Found existing group: 'SEO Manager'")

    # Also check if legacy 'SEO Blog Editor' group exists
    legacy_group = Group.objects.filter(name='SEO Blog Editor').first()

    # 2. Collect desired permissions for SEO Manager
    # Allowed codenames:
    allowed_codenames = [
        # SEO app permissions
        'view_pageseo', 'add_pageseo', 'change_pageseo', 'delete_pageseo',
        'view_pageheading', 'add_pageheading', 'change_pageheading', 'delete_pageheading',
        'view_imageseo', 'add_imageseo', 'change_imageseo', 'delete_imageseo',
        'view_seoredirect', 'add_seoredirect', 'change_seoredirect', 'delete_seoredirect',
        'view_seositesettings', 'change_seositesettings',

        # Blog app permissions (for blog SEO & article publishing)
        'view_blogpost', 'add_blogpost', 'change_blogpost', 'delete_blogpost',

        # Read-only reference & image caption editing for website assets
        'view_projectlocation',
        'view_district',
        'view_state',
        'view_projectimage', 'change_projectimage',
        'view_factoryprocess',
        'view_companyprofile',
    ]

    perms = Permission.objects.filter(codename__in=allowed_codenames)
    group.permissions.set(perms)
    group.save()
    print(f"Assigned {perms.count()} permissions to 'SEO Manager' group.")

    # 3. Configure existing 'seo_admin' user
    # Supabase password hash for seo_admin:
    existing_hash = 'pbkdf2_sha256$1000000$64lpNmxH28PuVr7TPSJpnf$CEXnHUXM7yc3oEV6IOQ7VKR2H2W/RqLefhpLcol6Pok='

    seo_user = User.objects.filter(username='seo_admin').first()
    if not seo_user:
        seo_user = User.objects.create(
            username='seo_admin',
            email='',
            is_staff=True,
            is_superuser=False,
            is_active=True,
            password=existing_hash
        )
        print("Initialized existing 'seo_admin' user record with preserved password hash.")
    else:
        seo_user.is_staff = True
        seo_user.is_superuser = False
        seo_user.is_active = True
        seo_user.save()
        print("Updated 'seo_admin' status: is_staff=True, is_superuser=False.")

    # Assign to SEO Manager group and remove from legacy group if present
    seo_user.groups.add(group)
    if legacy_group:
        seo_user.groups.remove(legacy_group)
    seo_user.save()

    print(f"User '{seo_user.username}': staff={seo_user.is_staff}, superuser={seo_user.is_superuser}, groups={[g.name for g in seo_user.groups.all()]}")

    # Verify projectmanager is untouched
    pm = User.objects.filter(username='projectmanager').first()
    if pm:
        print(f"Verified 'projectmanager': staff={pm.is_staff}, superuser={pm.is_superuser}, groups={[g.name for g in pm.groups.all()]}")

    print("Permission configuration complete!")


if __name__ == '__main__':
    configure_seo_admin_permissions()
