from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    date = models.CharField(max_length=50)   # keep simple for class demo
    time = models.CharField(max_length=50, blank=True)
    location = models.CharField(max_length=200, blank=True)

    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="events")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title