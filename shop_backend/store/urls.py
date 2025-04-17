from django.urls import path
from .views import (
    ProductListView, CategoryListView,
    ReviewListCreateView,
    FavoriteListCreateView, FavoriteDeleteView,
    OrderCreateView, OrderListView,
    AddressListCreateView,ReviewDetailView,ProductDetailView
)

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('products/<int:id>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/<int:product_id>/reviews/', ReviewListCreateView.as_view(), name='product-reviews'),

    path('favorites/', FavoriteListCreateView.as_view(), name='favorite-list-create'),
    path('favorites/<int:product_id>/', FavoriteDeleteView.as_view(), name='favorite-delete'),

    path('orders/create/', OrderCreateView.as_view(), name='order-create'),
    path('orders/', OrderListView.as_view(), name='order-list'),
    path('reviews/<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),
    path('addresses/', AddressListCreateView.as_view(), name='address-list-create'),
]
