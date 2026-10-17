from django.db import migrations


def relink_to_cloudinary(apps, schema_editor):
    ProjectImage = apps.get_model('projects', 'ProjectImage')

    # Map existing broken/legacy image filenames to their uploaded persistent Cloudinary public IDs
    cloudinary_mapping = {
        'coimbatore_1': 'media/projects/gallery/s9epmeckarem5sm8vswr',
        'coimbatore_2': 'media/projects/gallery/z9s7qhex5hwaj25jefve',
        'coimbatore_3': 'media/projects/gallery/aaj3njhlfdjud7gmjpuy',
        'coimbatore_4': 'media/projects/gallery/kxg2nqnbptrjdsavvufn',
        'tenkasi_3': 'media/projects/gallery/igeun9m5yijpqhbetyio',
        'tenkasi_house_1': 'media/projects/gallery/hw9w9hzrlc2zhvr3bnar',
        'tenkasi_resort_1': 'media/projects/gallery/vogqzu0ts8nclotajwqw',
        'tenkasi_resort_2': 'media/projects/gallery/y0h7mvutkngvinjy36ne',
    }

    for img in ProjectImage.objects.all():
        name = getattr(img.image, 'name', '') or ''
        for key, cloud_id in cloudinary_mapping.items():
            if key in name:
                img.image.name = cloud_id
                img.save(update_fields=['image'])
                break


def reverse_relink(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0002_relink_existing_project_images'),
    ]

    operations = [
        migrations.RunPython(relink_to_cloudinary, reverse_relink),
    ]
