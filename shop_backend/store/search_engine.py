from typing import List, Callable, Any
from store.models import Product,Category
from django.db.models import QuerySet


# 🔹 Ручная сортировка по полю
def custom_sort(products: List[Product], ordering: str) -> List[Product]:
    if ordering == 'price_asc':
        return sorted(products, key=lambda x: x.price or 0)
    elif ordering == 'price_desc':
        return sorted(products, key=lambda x: -(x.price or 0))
    elif ordering == 'name_asc':
        return sorted(products, key=lambda x: (x.name or '').lower())
    elif ordering == 'name_desc':
        return sorted(products, key=lambda x: (x.name or '').lower(), reverse=True)
    return products


def binary_search_id(query: str) -> List[Product]:
    print("Выполнен бинарный поиск по ID (ручной)")
    try:
        target_id = int(query)
    except ValueError:
        return []

    # Получаем отсортированные товары по id
    products = list(Product.objects.all().order_by("id"))

    left = 0
    right = len(products) - 1

    while left <= right:
        mid = (left + right) // 2
        current_id = products[mid].id

        if current_id == target_id:
            return [products[mid]]
        elif current_id < target_id:
            left = mid + 1
        else:
            right = mid - 1

    return []


def substring_search(query: str) -> List[Product]:
    print("Выполнен подстроковый поиск (одиночное слово)")
    results = []
    query = query.lower()
    for p in Product.objects.all():
        combined = f"{(p.name or '').lower()} {(p.description or '').lower()} {(p.brand or '').lower()} {(p.color or '').lower()}"
        if query in combined:
            results.append(p)
    return results


def multi_field_multi_word_search(query: str) -> List[Product]:
    print("Выполнен мультипоиск по нескольким словам и полям")
    words = query.lower().split()
    results = []
    for p in Product.objects.all():
        combined = f"{(p.name or '').lower()} {(p.description or '').lower()} {(p.brand or '').lower()} {(p.color or '').lower()}"
        if all(word in combined for word in words):
            results.append(p)
    return results


def auto_search(query: str) -> List[Product]:
    query = query.strip().lower()
    if not query:
        print("Пустой запрос")
        return []

    if query.isdigit():
        return binary_search_id(query)
    elif len(query.split()) > 1:
        return multi_field_multi_word_search(query)
    else:
        return substring_search(query)

def advanced_filter(
    products: QuerySet,
    category_id: int = None,
    gender: str = None,
    price_min: float = None,
    price_max: float = None
):
    # Категория
    if category_id:
        try:
            category = Category.objects.get(id=category_id)
            if category.parent is None:
                subcategories = Category.objects.filter(parent=category).values_list('id', flat=True)
                category_ids = list(subcategories) + [category.id]
                products = products.filter(category_id__in=category_ids)
            else:
                products = products.filter(category=category)
        except Category.DoesNotExist:
            pass

    # Пол
    if gender:
        products = products.filter(gender__iexact=gender)

    # Цена
    if price_min is not None:
        products = products.filter(price__gte=price_min)
    if price_max is not None:
        products = products.filter(price__lte=price_max)

    return products


