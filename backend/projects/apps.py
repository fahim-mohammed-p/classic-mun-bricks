from django.apps import AppConfig
from django.db.models.signals import post_migrate


def auto_reconcile_images(sender, **kwargs):
    try:
        from django.db import connection
        table_names = connection.introspection.table_names()
        if 'projects_projectimage' in table_names:
            from .models import ProjectImage
            from django.core.files.storage import default_storage
            import re

            for img in ProjectImage.objects.all():
                name = getattr(img.image, 'name', '')
                if name and not default_storage.exists(name):
                    clean_name = re.sub(r'_[a-zA-Z0-9]{7}(\.[a-zA-Z0-9]+)$', r'\1', name)
                    if clean_name != name and default_storage.exists(clean_name):
                        img.image.name = clean_name
                        img.save(update_fields=['image'])
                    elif 'tenkasi_house_1' in name and default_storage.exists('projects/gallery/tenkasi_house_1.jfif'):
                        img.image.name = 'projects/gallery/tenkasi_house_1.jfif'
                        img.save(update_fields=['image'])
                    elif 'tenkasi_resort_2' in name and default_storage.exists('projects/gallery/tenkasi_resort_2.jfif'):
                        img.image.name = 'projects/gallery/tenkasi_resort_2.jfif'
                        img.save(update_fields=['image'])
                    elif 'tenkasi_resort_1' in name and default_storage.exists('projects/gallery/tenkasi_resort_1.jfif'):
                        img.image.name = 'projects/gallery/tenkasi_resort_1.jfif'
                        img.save(update_fields=['image'])
    except Exception:
        pass


class ProjectsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'projects'
    verbose_name = 'Project Locations & Route'

    def ready(self):
        post_migrate.connect(auto_reconcile_images, sender=self)
