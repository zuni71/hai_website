from rest_framework import serializers
from .models import CardResponse

class CardResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardResponse
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at", "user")