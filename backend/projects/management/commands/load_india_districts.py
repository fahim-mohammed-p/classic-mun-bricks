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

        # Seed initial genuine Classic Mun Bricks operational project locations
        # (Only official districts in Kerala and Tamil Nadu corridors)
        INITIAL_ACTIVE_DISTRICTS = [
            {"name": "Malappuram", "state": "Kerala", "is_hub": True, "hub_label": "Plant & HQ (Kodur)", "order": 1},
            {"name": "Kozhikode", "state": "Kerala", "is_hub": False, "hub_label": "", "order": 2},
            {"name": "Palakkad", "state": "Kerala", "is_hub": False, "hub_label": "", "order": 3},
            {"name": "Thrissur", "state": "Kerala", "is_hub": False, "hub_label": "", "order": 4},
            {"name": "Coimbatore", "state": "Tamil Nadu", "is_hub": False, "hub_label": "", "order": 5},
            {"name": "Tiruppur", "state": "Tamil Nadu", "is_hub": False, "hub_label": "", "order": 6},
            {"name": "Erode", "state": "Tamil Nadu", "is_hub": False, "hub_label": "", "order": 7},
            {"name": "Salem", "state": "Tamil Nadu", "is_hub": False, "hub_label": "", "order": 8},
            {"name": "Dindigul", "state": "Tamil Nadu", "is_hub": False, "hub_label": "", "order": 9},
        ]

        active_created = 0
        for item in INITIAL_ACTIVE_DISTRICTS:
            try:
                district = District.objects.get(name=item["name"], state__name=item["state"])
                loc, created = ProjectLocation.objects.update_or_create(
                    district=district,
                    defaults={
                        "is_factory_hub": item["is_hub"],
                        "hub_label": item["hub_label"],
                        "is_active": True,
                        "order": item["order"],
                    }
                )
                if created:
                    active_created += 1
            except District.DoesNotExist:
                self.stderr.write(self.style.WARNING(f"District {item['name']} not found in master data"))

        self.stdout.write(
            self.style.SUCCESS(
                f"Classic Mun Bricks Project Locations active: {len(INITIAL_ACTIVE_DISTRICTS)} locations configured ({active_created} newly created)."
            )
        )
