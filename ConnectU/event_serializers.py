from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):
    created_by_id = serializers.IntegerField(source="created_by.id", read_only=True)
    created_by_username = serializers.CharField(source="created_by.username", read_only=True)

    attendee_count = serializers.SerializerMethodField()
    is_attending = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = (
            "id",
            "title",
            "description",
            "date",
            "time",
            "location",
            "created_at",
            "created_by_id",
            "created_by_username",
            "attendee_count",
            "is_attending",
        )

    def get_attendee_count(self, obj):
        return obj.attendees.count()

    def get_is_attending(self, obj):
        request = self.context.get("request")
        if not request or not hasattr(request, "user") or not request.user.is_authenticated:
            return False
        return obj.attendees.filter(id=request.user.id).exists()