from rest_framework import serializers
from .models import Category, Product, Order, OrderItem, Address, Favorite, Review
from django.contrib.auth.models import User


class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'parent', 'children']

    def get_children(self, obj):
        children = obj.children.all()
        return CategorySerializer(children, many=True).data


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'gender', 'image',
                  'stock', 'category', 'category_id', 'average_rating']

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews:
            return round(sum(r.rating for r in reviews) / len(reviews), 1)
        return None


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'product', 'rating', 'comment', 'created_at']


class FavoriteSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'product']


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    items = OrderItemSerializer(many=True)
    address = AddressSerializer()

    class Meta:
        model = Order
        fields = ['id', 'user', 'address', 'created_at', 'total', 'is_paid', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        address_data = validated_data.pop('address')
        address = Address.objects.create(**address_data, user=validated_data['user'])
        order = Order.objects.create(address=address, **validated_data)
        total = 0
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            OrderItem.objects.create(order=order, product=product, quantity=quantity)
            total += product.price * quantity
        order.total = total
        order.save()
        return order
