from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CardResponseViewSet

router = DefaultRouter()
router.register(r"card-responses", CardResponseViewSet, basename="card-response")

urlpatterns = [
    path("", include(router.urls)),
]