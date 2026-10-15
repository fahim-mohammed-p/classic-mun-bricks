import re
from django.db import migrations


def relink_images(apps, schema_editor):
    ProjectImage = apps.get_model('projects', 'ProjectImage')
    from django.core.files.storage import default_storage

    for img in ProjectImage.objects.all():
        name = getattr(img.image, 'name', '')
        if not name:
            continue

        # If file exists as is, no change needed
        if default_storage.exists(name):
            continue

        # Remove 7-character random Django collision suffix: _xxxxxxx.ext
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


def reverse_relink(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(relink_images, reverse_relink),
    ]
