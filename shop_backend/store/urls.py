from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    ProductListView, CategoryListView,
    FavoriteListCreateView, FavoriteDeleteView,
    OrderCreateView, OrderListView,
    AddressListCreateView,ReviewDetailView,ProductDetailView,RegisterView,
    ReviewListView, ReviewCreateView, ReviewDetailView,user_profile,
    MyTokenObtainPairView,ChangePasswordView,AddressRetrieveUpdateDestroyView
)

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('products/<int:id>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/<int:product_id>/reviews/', ReviewListView.as_view(), name='product-reviews'),
    path('reviews/', ReviewCreateView.as_view(), name='review-create'),
    path('reviews/<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),
    path('profile/', user_profile, name='user-profile'),
    path('favorites/', FavoriteListCreateView.as_view(), name='favorite-list-create'),
    path('favorites/<int:product_id>/', FavoriteDeleteView.as_view(), name='favorite-delete'),
    path('register/', RegisterView.as_view(), name='register'),
    path('orders/', OrderCreateView.as_view(), name='order-create'),
    path('orders/', OrderListView.as_view(), name='order-list'),
    path('reviews/<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),
    path('addresses/', AddressListCreateView.as_view()),
    path('addresses/<int:pk>/', AddressRetrieveUpdateDestroyView.as_view()),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
]
