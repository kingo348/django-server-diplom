from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Category, Product, Address, Order, OrderItem, Favorite, Review


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock', 'category', 'gender')  # отображаемые поля
    list_filter = ('category', 'gender')  # фильтрация справа
    search_fields = ('name', 'description')  # строка поиска

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "category":
            # Показываем только подкатегории (у которых есть parent)
            kwargs["queryset"] = Category.objects.exclude(parent=None)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent')
    list_filter = ('parent',)
    search_fields = ('name',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at', 'total', 'is_paid')
    list_filter = ('is_paid', 'created_at')
    search_fields = ('user__username',)

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity')

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'city', 'street', 'postal_code')
    search_fields = ('city', 'street')

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'product')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'rating', 'created_at')
    list_filter = ('rating',)
    search_fields = ('user__username', 'product__name')

