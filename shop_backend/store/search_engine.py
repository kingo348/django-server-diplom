from typing import List, Callable, Any
from store.models import Product,Category
from django.db.models import QuerySet
import time
import nltk
from django.db.models import Q
from django.contrib.postgres.search import TrigramSimilarity, SearchVector, SearchQuery
from nltk.stem.snowball import SnowballStemmer
from nltk.tokenize import word_tokenize
nltk.download('punkt')
stemmer = SnowballStemmer("russian")

def stem_text(text: str) -> list[str]:
    tokens = word_tokenize(text.lower())
    return [stemmer.stem(token) for token in tokens if token.isalpha()]

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
    print("Выполнен бинарный поиск по ID")
    try:
        target_id = int(query)
    except ValueError:
        return []

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


def substring_search(query: str) -> list[Product]:
    print("Выполнен подстроковый поиск (TrigramSimilarity + GIN + fallback + морфология)")

    stemmed_query = " ".join(stem_text(query))

    return list(
        Product.objects.annotate(
            sim_plain=TrigramSimilarity('search_text', query),
            sim_stemmed=TrigramSimilarity('stemmed_text', stemmed_query),
        ).filter(
            Q(sim_plain__gt=0.1) |
            Q(search_text__icontains=query) |
            Q(sim_stemmed__gt=0.1) |
            Q(stemmed_text__icontains=stemmed_query)
        ).order_by('-sim_stemmed', '-sim_plain')
    )




def multi_field_multi_word_search(query: str) -> List[Product]:
    print("Выполнен мультисловный поиск (PostgreSQL full-text с индексом)")
    search_query = SearchQuery(query)
    return list(Product.objects.filter(search_vector=search_query))


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
    if gender:
        products = products.filter(gender__iexact=gender)
    if price_min is not None:
        products = products.filter(price__gte=price_min)
    if price_max is not None:
        products = products.filter(price__lte=price_max)
    return products


