from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    date = models.CharField(max_length=50)
    time = models.CharField(max_length=50, blank=True)
    location = models.CharField(max_length=200, blank=True)

    attendees = models.ManyToManyField(User, related_name="joined_events", blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="events")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

from django.conf import settings

class Group(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True, default="")
    category = models.CharField(max_length=60, blank=True, default="")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="groups_created",
    )
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="groups_joined",
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name