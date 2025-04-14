from django.shortcuts import render
from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from .models import Product, Category, Order, OrderItem, Address, Review, Favorite
from .serializers import (
    ProductSerializer, CategorySerializer, OrderSerializer,
    AddressSerializer, ReviewSerializer, FavoriteSerializer
)
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

#  Товары
class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'gender']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'name']

    def get_queryset(self):
        queryset = Product.objects.all()
        parent_id = self.request.query_params.get('category_parent')

        if parent_id:
            # Найдём все подкатегории указанной родительской категории
            subcategories = Category.objects.filter(parent_id=parent_id).values_list('id', flat=True)
            # Вернём продукты, у которых категория — одна из этих подкатегорий
            queryset = queryset.filter(category_id__in=subcategories)

        return queryset


#  Категории
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(parent=None)  # Показываем только родительские
    serializer_class = CategorySerializer


#  Отзывы
class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        product_id = self.kwargs.get("product_id")
        return Review.objects.filter(product_id=product_id)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


#  Избранное
class FavoriteListCreateView(generics.ListCreateAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FavoriteDeleteView(generics.DestroyAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'product_id'

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)


#  Заказы
class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


#  Адреса
class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

