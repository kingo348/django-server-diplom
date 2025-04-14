import csv
import os
import django

# Устанавливаем Django окружение
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop_backend.settings')
django.setup()

from store.models import Product, Category

CSV_PATH = 'C:\\Users\\vanyl\\Downloads\\generated_products.csv'  # путь до CSV

def load_products_from_csv(csv_path):
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        count = 0
        for row in reader:
            try:
                category = Category.objects.get(id=int(row['category_id']))
                Product.objects.create(
                    name=row['name'],
                    description=row['description'],
                    price=float(row['price']),
                    gender=row['gender'],
                    stock=int(row['stock']),
                    category=category
                )
                count += 1
            except Exception as e:
                print(f"Ошибка на строке {reader.line_num}: {e}")

        print(f"Успешно добавлено {count} товаров.")

if __name__ == '__main__':
    load_products_from_csv(CSV_PATH)
