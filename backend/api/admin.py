from django.contrib import admin

from .models import CardResponse


@admin.register(CardResponse)
class CardResponseAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "card_id",
        "swipe_direction",
        "liked",
        "skipped",
        "created_at",
    )
    list_filter = ("liked", "skipped", "swipe_direction")
    search_fields = ("card_id", "comment", "user__username")