from django.db import models
from django.conf import settings

class CardResponse(models.Model):
    class SwipeDirection(models.TextChoices):
        LEFT = "left", "Left"
        RIGHT = "right", "Right"
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="card_responses",
    )
    card_id = models.CharField(max_length=100)
    swipe_direction = models.CharField(
        max_length=5,
        choices=SwipeDirection.choices,
        null=True,
        blank=True,
    )
    comment = models.TextField(blank=True)
    user_background = models.TextField(blank=True)
    liked = models.BooleanField(default=False)
    skipped = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "card_id"],
                name="unique_user_card_response",
            )
        ]

    def __str__(self):
        return f"{self.user} - {self.card_id}"