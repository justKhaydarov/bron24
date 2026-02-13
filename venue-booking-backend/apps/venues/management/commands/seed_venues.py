from decimal import Decimal

from django.core.management.base import BaseCommand

from apps.venues.models import Venue

VENUES_DATA = [
    {
        "name_ru": "Конференц-зал «Самарканд»",
        "name_uz": "Samarqand konferentsiya zali",
        "name_en": "Samarkand Conference Hall",
        "address_ru": "г. Ташкент, ул. Навои 23",
        "address_uz": "Toshkent sh., Navoiy ko'chasi 23",
        "address_en": "23 Navoi Street, Tashkent",
        "description_ru": "Современный конференц-зал вместимостью до 100 человек, оборудованный проектором и звуковой системой.",
        "description_uz": "100 kishigacha sig'adigan zamonaviy konferentsiya zali, proyektor va ovoz tizimi bilan jihozlangan.",
        "description_en": "Modern conference hall for up to 100 people, equipped with projector and sound system.",
        "price_per_hour": Decimal("500000.00"),
        "amenities_ru": ["Проектор", "Wi-Fi", "Кондиционер", "Звуковая система"],
        "amenities_uz": ["Proyektor", "Wi-Fi", "Konditsioner", "Ovoz tizimi"],
        "amenities_en": ["Projector", "Wi-Fi", "AC", "Sound System"],
    },
    {
        "name_ru": "Банкетный зал «Бухара»",
        "name_uz": "Buxoro banket zali",
        "name_en": "Bukhara Banquet Hall",
        "address_ru": "г. Ташкент, ул. Амира Темура 56",
        "address_uz": "Toshkent sh., Amir Temur ko'chasi 56",
        "address_en": "56 Amir Temur Street, Tashkent",
        "description_ru": "Роскошный банкетный зал для свадеб и торжеств на 200 гостей.",
        "description_uz": "To'y va tantanalar uchun 200 kishilik hashamatli banket zali.",
        "description_en": "Luxurious banquet hall for weddings and celebrations, up to 200 guests.",
        "price_per_hour": Decimal("1200000.00"),
        "amenities_ru": ["Сцена", "Танцпол", "Кухня", "Парковка", "Кондиционер"],
        "amenities_uz": ["Sahna", "Raqs maydoni", "Oshxona", "Avtoturargoh", "Konditsioner"],
        "amenities_en": ["Stage", "Dance Floor", "Kitchen", "Parking", "AC"],
    },
    {
        "name_ru": "Коворкинг «Digital Hub»",
        "name_uz": "Digital Hub kovorking",
        "name_en": "Digital Hub Coworking",
        "address_ru": "г. Ташкент, ул. Шота Руставели 12",
        "address_uz": "Toshkent sh., Shota Rustaveli ko'chasi 12",
        "address_en": "12 Shota Rustaveli Street, Tashkent",
        "description_ru": "Современное коворкинг-пространство с высокоскоростным интернетом.",
        "description_uz": "Yuqori tezlikdagi internet bilan zamonaviy kovorking maydoni.",
        "description_en": "Modern coworking space with high-speed internet.",
        "price_per_hour": Decimal("100000.00"),
        "amenities_ru": ["Wi-Fi", "Кофе", "Принтер", "Кондиционер"],
        "amenities_uz": ["Wi-Fi", "Qahva", "Printer", "Konditsioner"],
        "amenities_en": ["Wi-Fi", "Coffee", "Printer", "AC"],
    },
    {
        "name_ru": "Спортивный зал «Олимп»",
        "name_uz": "Olimp sport zali",
        "name_en": "Olymp Sports Hall",
        "address_ru": "г. Ташкент, ул. Мустакиллик 78",
        "address_uz": "Toshkent sh., Mustaqillik ko'chasi 78",
        "address_en": "78 Mustaqillik Street, Tashkent",
        "description_ru": "Полноценный спортивный зал для тренировок и мероприятий.",
        "description_uz": "Mashg'ulotlar va tadbirlar uchun to'liq sport zali.",
        "description_en": "Full-scale sports hall for training and events.",
        "price_per_hour": Decimal("300000.00"),
        "amenities_ru": ["Раздевалки", "Душ", "Инвентарь", "Парковка"],
        "amenities_uz": ["Kiyinish xonalari", "Dush", "Inventar", "Avtoturargoh"],
        "amenities_en": ["Locker Rooms", "Showers", "Equipment", "Parking"],
    },
    {
        "name_ru": "Фотостудия «Pixel»",
        "name_uz": "Pixel fotostudiya",
        "name_en": "Pixel Photo Studio",
        "address_ru": "г. Ташкент, ул. Бабура 34",
        "address_uz": "Toshkent sh., Bobur ko'chasi 34",
        "address_en": "34 Babur Street, Tashkent",
        "description_ru": "Профессиональная фотостудия с освещением и фонами.",
        "description_uz": "Yoritish va fonlar bilan professional fotostudiya.",
        "description_en": "Professional photo studio with lighting and backdrops.",
        "price_per_hour": Decimal("250000.00"),
        "amenities_ru": ["Студийный свет", "Фоны", "Гримёрная", "Wi-Fi"],
        "amenities_uz": ["Studiya yorug'ligi", "Fonlar", "Grimyorxona", "Wi-Fi"],
        "amenities_en": ["Studio Lights", "Backdrops", "Makeup Room", "Wi-Fi"],
    },
    {
        "name_ru": "Зал для йоги «Гармония»",
        "name_uz": "Garmoniya yoga zali",
        "name_en": "Harmony Yoga Studio",
        "address_ru": "г. Ташкент, ул. Чиланзар 5",
        "address_uz": "Toshkent sh., Chilonzor ko'chasi 5",
        "address_en": "5 Chilanzar Street, Tashkent",
        "description_ru": "Спокойное пространство для занятий йогой и медитацией.",
        "description_uz": "Yoga va meditatsiya mashg'ulotlari uchun tinch makon.",
        "description_en": "Peaceful space for yoga and meditation sessions.",
        "price_per_hour": Decimal("150000.00"),
        "amenities_ru": ["Коврики", "Зеркала", "Звуковая система", "Кондиционер"],
        "amenities_uz": ["Gilamchalar", "Oynalar", "Ovoz tizimi", "Konditsioner"],
        "amenities_en": ["Mats", "Mirrors", "Sound System", "AC"],
    },
    {
        "name_ru": "Лофт «Creative Space»",
        "name_uz": "Creative Space loft",
        "name_en": "Creative Space Loft",
        "address_ru": "г. Ташкент, ул. Кичик Халка Йули 90",
        "address_uz": "Toshkent sh., Kichik Xalqa Yo'li 90",
        "address_en": "90 Kichik Khalka Yuli Street, Tashkent",
        "description_ru": "Стильный лофт для мероприятий, съёмок и вечеринок.",
        "description_uz": "Tadbirlar, suratga olish va ziyofatlar uchun zamonaviy loft.",
        "description_en": "Stylish loft for events, photoshoots and parties.",
        "price_per_hour": Decimal("400000.00"),
        "amenities_ru": ["Бар", "DJ-оборудование", "Проектор", "Кухня"],
        "amenities_uz": ["Bar", "DJ jihozlari", "Proyektor", "Oshxona"],
        "amenities_en": ["Bar", "DJ Equipment", "Projector", "Kitchen"],
    },
    {
        "name_ru": "Переговорная «Минимал»",
        "name_uz": "Minimal muzokaralar xonasi",
        "name_en": "Minimal Meeting Room",
        "address_ru": "г. Ташкент, ул. Юнусабад 17",
        "address_uz": "Toshkent sh., Yunusobod ko'chasi 17",
        "address_en": "17 Yunusabad Street, Tashkent",
        "description_ru": "Компактная переговорная комната на 8 человек.",
        "description_uz": "8 kishilik ixcham muzokaralar xonasi.",
        "description_en": "Compact meeting room for up to 8 people.",
        "price_per_hour": Decimal("80000.00"),
        "amenities_ru": ["Проектор", "Wi-Fi", "Маркерная доска", "Кондиционер"],
        "amenities_uz": ["Proyektor", "Wi-Fi", "Marker doskasi", "Konditsioner"],
        "amenities_en": ["Projector", "Wi-Fi", "Whiteboard", "AC"],
    },
    {
        "name_ru": "Зал для мастер-классов «Usta»",
        "name_uz": "Usta master-klass zali",
        "name_en": "Usta Workshop Hall",
        "address_ru": "г. Ташкент, ул. Гагарина 45",
        "address_uz": "Toshkent sh., Gagarin ko'chasi 45",
        "address_en": "45 Gagarin Street, Tashkent",
        "description_ru": "Универсальный зал для проведения мастер-классов и тренингов.",
        "description_uz": "Master-klasslar va treninglar uchun universal zal.",
        "description_en": "Versatile hall for workshops and training sessions.",
        "price_per_hour": Decimal("200000.00"),
        "amenities_ru": ["Столы", "Стулья", "Проектор", "Wi-Fi", "Чайная зона"],
        "amenities_uz": ["Stollar", "Stullar", "Proyektor", "Wi-Fi", "Choy zonasi"],
        "amenities_en": ["Tables", "Chairs", "Projector", "Wi-Fi", "Tea Area"],
    },
    {
        "name_ru": "Банкетный зал «Наврўз»",
        "name_uz": "Navro'z banket zali",
        "name_en": "Navruz Banquet Hall",
        "address_ru": "г. Ташкент, ул. Беруний 62",
        "address_uz": "Toshkent sh., Beruniy ko'chasi 62",
        "address_en": "62 Beruniy Street, Tashkent",
        "description_ru": "Традиционный банкетный зал с восточным интерьером на 150 гостей.",
        "description_uz": "Sharqona interyerli 150 kishilik an'anaviy banket zali.",
        "description_en": "Traditional banquet hall with oriental interior for up to 150 guests.",
        "price_per_hour": Decimal("900000.00"),
        "amenities_ru": ["Сцена", "Кухня", "Парковка", "Кондиционер", "Зал ожидания"],
        "amenities_uz": ["Sahna", "Oshxona", "Avtoturargoh", "Konditsioner", "Kutish zali"],
        "amenities_en": ["Stage", "Kitchen", "Parking", "AC", "Waiting Area"],
    },
    {
        "name_ru": "Киберспорт-арена «GG»",
        "name_uz": "GG kibersport arenasi",
        "name_en": "GG Esports Arena",
        "address_ru": "г. Ташкент, ул. Нукусская 15",
        "address_uz": "Toshkent sh., Nukus ko'chasi 15",
        "address_en": "15 Nukus Street, Tashkent",
        "description_ru": "Профессиональная киберспорт-арена с мощными ПК и стриминг-оборудованием.",
        "description_uz": "Kuchli kompyuterlar va striming jihozlari bilan professional kibersport arenasi.",
        "description_en": "Professional esports arena with powerful PCs and streaming equipment.",
        "price_per_hour": Decimal("350000.00"),
        "amenities_ru": ["Игровые ПК", "Стриминг", "Wi-Fi", "Снэк-бар"],
        "amenities_uz": ["O'yin kompyuterlari", "Striming", "Wi-Fi", "Snek-bar"],
        "amenities_en": ["Gaming PCs", "Streaming", "Wi-Fi", "Snack Bar"],
    },
    {
        "name_ru": "Танцевальная студия «Ritm»",
        "name_uz": "Ritm raqs studiyasi",
        "name_en": "Ritm Dance Studio",
        "address_ru": "г. Ташкент, ул. Олмазор 29",
        "address_uz": "Toshkent sh., Olmazor ko'chasi 29",
        "address_en": "29 Olmazor Street, Tashkent",
        "description_ru": "Просторная танцевальная студия с зеркалами и профессиональным покрытием.",
        "description_uz": "Oynalar va professional qoplama bilan keng raqs studiyasi.",
        "description_en": "Spacious dance studio with mirrors and professional flooring.",
        "price_per_hour": Decimal("180000.00"),
        "amenities_ru": ["Зеркала", "Звуковая система", "Раздевалки", "Кондиционер"],
        "amenities_uz": ["Oynalar", "Ovoz tizimi", "Kiyinish xonalari", "Konditsioner"],
        "amenities_en": ["Mirrors", "Sound System", "Locker Rooms", "AC"],
    },
]


class Command(BaseCommand):
    help = "Seed the database with sample venue data (12 venues)"

    def handle(self, *args, **options):
        created_count = 0

        for data in VENUES_DATA:
            # Check if venue already exists (by Russian name)
            if Venue.objects.filter(name_ru=data["name_ru"]).exists():
                self.stdout.write(
                    self.style.WARNING(f"Skipping (exists): {data['name_ru']}")
                )
                continue

            Venue.objects.create(**data)
            created_count += 1
            self.stdout.write(self.style.SUCCESS(f"Created: {data['name_ru']}"))

        self.stdout.write(
            self.style.SUCCESS(f"\nDone! Created {created_count} venues.")
        )
