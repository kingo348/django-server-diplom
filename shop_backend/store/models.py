
from django.db import models
from django.contrib.postgres.indexes import GinIndex
from django.contrib.postgres.search import SearchVectorField, SearchVector
from django.db.models.signals import post_save
from django.dispatch import receiver


FIELD = models.CharField(max_length=50, blank=True)
MODELS_CHAR_FIELD = models.CharField(max_length=200)

from django.contrib.auth.models import User
from nltk.stem.snowball import SnowballStemmer
from nltk.tokenize import word_tokenize

stemmer = SnowballStemmer("russian")

def stem_text(text: str) -> list[str]:
    tokens = word_tokenize(text.lower())
    return [stemmer.stem(token) for token in tokens if token.isalpha()]

class Category(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey(
        'self', on_delete=models.CASCADE, null=True, blank=True, related_name='children'
    )

    def __str__(self):
        return self.name




class Product(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    gender = models.CharField(max_length=10, choices=[("Мужской", "Мужской"), ("Женский", "Женский")])
    image = models.URLField(max_length=500, null=True, blank=True)
    stock = models.PositiveIntegerField(default=0)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    sizes = models.CharField(max_length=100, blank=True)
    color = models.CharField(max_length=50, blank=True)
    brand = models.CharField(max_length=100, blank=True)
    stemmed_text = models.TextField(blank=True, default="")
    search_text = models.TextField(blank=True, default="")
    search_vector = SearchVectorField(null=True)

    class Meta:
        indexes = [
            GinIndex(fields=["search_text"], name="search_text_gin_idx", opclasses=["gin_trgm_ops"]),
            GinIndex(fields=['search_vector'], name='product_fts_idx'),
            models.Index(fields=["category"], name="category_idx"),
            models.Index(fields=["gender"], name="gender_idx"),
            models.Index(fields=["price"], name="price_idx"),
        ]

    def save(self, *args, **kwargs):
        combined = f"{self.name or ''} {self.description or ''} {self.brand or ''} {self.color or ''}"
        self.search_text = combined
        self.stemmed_text = " ".join(stem_text(combined))
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    city = models.CharField(max_length=100)
    street = MODELS_CHAR_FIELD
    postal_code = models.CharField(max_length=20)

    def __str__(self):
        return f'{self.city}, {self.street}'



class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_paid = models.BooleanField(default=False)

    def __str__(self):
        return f'Order #{self.id} от {self.user.username}'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f'{self.quantity} x {self.product.name}'

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='favorited_by')

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f'{self.user.username} → {self.product.name}'

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveIntegerField(default=5)  # от 1 до 5
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Отзыв от {self.user.username} на {self.product.name}'



@receiver(post_save, sender=Product)
def update_search_vector(sender, instance, **kwargs):
    Product.objects.filter(id=instance.id).update(
        search_vector=(
            SearchVector('name', weight='A') +
            SearchVector('description', weight='B') +
            SearchVector('brand', weight='C') +
            SearchVector('color', weight='D')
        )
    )
