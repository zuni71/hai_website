from django.shortcuts import render

from rest_framework import viewsets, permissions
from .models import CardResponse
from .serializers import CardResponseSerializer

class CardResponseViewSet(viewsets.ModelViewSet):
    serializer_class = CardResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CardResponse.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)