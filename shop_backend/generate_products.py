import os
import django
import random
from faker import Faker

L = []

# Подключаем Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop_backend.settings')
django.setup()

from store.models import Category, Product
from django.db import transaction

fake = Faker('ru_RU')

def create_categories():
    categories_structure = {
        'Одежда': ['Футболки', 'Платья', 'Джинсы', 'Рубашки', 'Куртки', 'Толстовки'],
        'Обувь': ['Кроссовки', 'Ботинки', 'Сандалии', 'Туфли', 'Лоферы', 'Шлёпанцы']
    }

    created_subs = L

    for parent_name, sub_names in categories_structure.items():
        parent, _ = Category.objects.get_or_create(name=parent_name, parent=None)

        for sub in sub_names:
            sub_cat, created = Category.objects.get_or_create(name=sub, parent=parent)
            if created:
                print(f"✅ Подкатегория '{sub}' добавлена к '{parent.name}'")
            created_subs.append(sub_cat)

    return created_subs


def generate_products(count=10000):
    subcategories = create_categories()

    if not subcategories:
        print("❌ Подкатегории не найдены.")
        return

    products = []

    for _ in range(count):
        category = random.choice(subcategories)
        gender = random.choice(["Мужской", "Женский"])
        name = fake.word().capitalize() + " " + fake.color_name()

        product = Product(
            name=name,
            description=fake.text(max_nb_chars=200),
            price=round(random.uniform(1000, 15000), 2),
            gender=gender,
            stock=random.randint(1, 100),
            category=category
        )
        products.append(product)

    with transaction.atomic():
        Product.objects.bulk_create(products, batch_size=1000)

    print(f"✅ Успешно создано {count} товаров!")

if __name__ == '__main__':
    generate_products()
