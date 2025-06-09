from typing import List, Callable, Any
from store.models import Product


# 🔹 Ручная сортировка по полю
def custom_sort(products: List[Product], ordering: str) -> List[Product]:
    key = 'price'
    reverse = False

    if ordering == 'price_desc':
        key = 'price'
        reverse = True
    elif ordering == 'name_asc':
        key = 'name'
        reverse = False
    elif ordering == 'name_desc':
        key = 'name'
        reverse = True
    else:
        ordering = 'price_asc'

    try:
        return sorted(products, key=lambda x: getattr(x, key), reverse=reverse)
    except AttributeError:
        return products


def binary_search_id(query: str) -> List[Product]:
    print("Выполнен бинарный поиск по ID")
    target_id = int(query)
    for p in Product.objects.all():
        if p.id == target_id:
            return [p]
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


