from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Позволяет редактировать объект только владельцу.
    Остальные могут только читать.
    """
    def has_object_permission(self, request, view, obj):
        # Разрешаем безопасные методы (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True
        # Разрешаем только владельцу объекта
        return obj.user == request.user
