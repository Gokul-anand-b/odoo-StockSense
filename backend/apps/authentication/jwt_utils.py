"""
Custom JWT token serializer that injects user role and identity into token claims.
"""

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class StockSenseTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Extends the default JWT serializer to embed custom claims:
      - user_id (UUID)
      - email
      - role  (inventory_manager | warehouse_staff)
      - full_name
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Custom claims
        token['user_id'] = str(user.id)
        token['email'] = user.email
        token['role'] = user.role
        token['full_name'] = user.full_name

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Include user info in the response body as well
        data['user'] = {
            'id': str(self.user.id),
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'role': self.user.role,
            'full_name': self.user.full_name,
            'phone': self.user.phone,
            'avatar_url': self.user.avatar_url,
        }

        return data


class StockSenseTokenObtainPairView(TokenObtainPairView):
    """Login endpoint using the custom token serializer."""
    serializer_class = StockSenseTokenObtainPairSerializer
