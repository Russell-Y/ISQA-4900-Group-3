from rest_framework import serializers
from .models import Group

class GroupSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ("id", "name", "category", "description", "created_by", "member_count", "is_member")

    def get_member_count(self, obj):
        return obj.members.count()

    def get_is_member(self, obj):
        request = self.context.get("request")
        if not request or not request.user or not request.user.is_authenticated:
            return False
        return obj.members.filter(id=request.user.id).exists()