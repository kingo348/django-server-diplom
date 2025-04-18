from django.shortcuts import render
from rest_framework import generics, permissions, viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Product, Category, Order, OrderItem, Address, Review, Favorite
from .serializers import (
    ProductSerializer, CategorySerializer, OrderSerializer,
    AddressSerializer, ReviewSerializer, FavoriteSerializer,
    RegisterSerializer,
)
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.exceptions import PermissionDenied
from .permissions import IsOwnerOrReadOnly
from django.contrib.auth.models import User
from .serializers import MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.password_validation import validate_password
#  Товары
class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'name']

    def get_queryset(self):

        queryset = Product.objects.all()


        selected_category_id = self.request.query_params.get('category')
        if selected_category_id:
            try:
                selected_category_id = int(selected_category_id)
                category = Category.objects.get(id=selected_category_id)

                if category.parent is None:
                    subcategories = Category.objects.filter(parent=category).values_list('id', flat=True)
                    category_ids = list(subcategories) + [category.id]
                    queryset = queryset.filter(category_id__in=category_ids)
                else:
                    queryset = queryset.filter(category_id=category.id)
            except (Category.DoesNotExist, ValueError):
                pass


        return self.filter_queryset(queryset).order_by('id')


#  Категории
class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        parent_id = self.request.query_params.get('parent_id')
        if parent_id:
            return Category.objects.filter(parent_id=parent_id)  # Показываем подкатегории
        return Category.objects.filter(parent=None)  # Показываем только родительские категории



class ReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        product_id = self.kwargs.get("product_id")
        return Review.objects.filter(product_id=product_id)

# Добавление нового отзыва
class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly]

    def perform_update(self, serializer):
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
    permission_classes = [IsAuthenticated,IsOwnerOrReadOnly]
    lookup_field = 'product_id'

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)


#  Заказы
class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AddressRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'id'  # Делаем lookup по id товара

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    if request.method == 'GET':
        return Response({
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        })

    elif request.method == 'PUT':
        data = request.data
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.email = data.get('email', user.email)
        user.save()
        return Response({'detail': 'Профиль обновлён'})

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not user.check_password(old_password):
            return Response({'detail': 'Неверный старый пароль'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({'detail': 'Пароли не совпадают'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(new_password, user=user)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({'detail': 'Пароль успешно изменён'})