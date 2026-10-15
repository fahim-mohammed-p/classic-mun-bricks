import json
import os
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from projects.models import State, District, ProjectLocation


class Command(BaseCommand):
    help = 'Loads official Indian states and district master data with coordinates and seeds initial active locations'

    def handle(self, *args, **options):
        json_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            'data',
            'india_districts.json'
        )

        if not os.path.exists(json_path):
            self.stderr.write(self.style.ERROR(f"Data file not found at: {json_path}"))
            return

        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        state_count = 0
        district_count = 0

        for state_item in data:
            state_name = state_item.get('state')
            state_code = state_item.get('code', '')

            state_obj, _ = State.objects.update_or_create(
                name=state_name,
                defaults={'code': state_code}
            )
            state_count += 1

            for dist_item in state_item.get('districts', []):
                dist_name = dist_item.get('name')
                lat = dist_item.get('lat')
                lng = dist_item.get('lng')
                slug = slugify(f"{dist_name}-{state_name}")

                District.objects.update_or_create(
                    name=dist_name,
                    state=state_obj,
                    defaults={
                        'latitude': lat,
                        'longitude': lng,
                        'slug': slug,
                    }
                )
                district_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully loaded India Master Data: {state_count} States/UTs, {district_count} Districts."
            )
        )
