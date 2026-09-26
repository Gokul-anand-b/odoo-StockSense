"""
Role-based permission classes for StockSense API endpoints.
"""

from rest_framework.permissions import BasePermission


class IsInventoryManager(BasePermission):
    """
    Allow access only to users with the Inventory Manager role.

    Use on endpoints that manage products, warehouses, user accounts,
    forecasting configuration, and system-wide settings.
    """

    message = 'Access restricted to Inventory Managers.'

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'inventory_manager'
        )


class IsWarehouseStaff(BasePermission):
    """
    Allow access only to users with the Warehouse Staff role.

    Use on endpoints scoped to day-to-day operations: stock moves,
    barcode scanning, and alert acknowledgements.
    """

    message = 'Access restricted to Warehouse Staff.'

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'warehouse_staff'
        )


class IsManagerOrReadOnly(BasePermission):
    """
    Inventory Managers get full CRUD; all other authenticated users
    get read-only access (GET, HEAD, OPTIONS).
    """

    message = 'Write access restricted to Inventory Managers.'

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True
        return request.user.role == 'inventory_manager'


class IsOwnerOrManager(BasePermission):
    """
    Object-level permission: allows the resource owner or any
    Inventory Manager to access the object.
    """

    message = 'You can only access your own resources.'

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'inventory_manager':
            return True
        # Object must have a `user` or `created_by` FK
        owner = getattr(obj, 'user', None) or getattr(obj, 'created_by', None)
        return owner == request.user
