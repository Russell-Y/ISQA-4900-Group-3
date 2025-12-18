from django.shortcuts import render
from django.views import View

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import RegisterSerializer
from .models import Event
from .event_serializers import EventSerializer


class LoginView(View):
    def get(self, request):
        return render(request, "login.html")

    def post(self, request):
        return render(request, "login.html")


@api_view(["POST"])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"id": user.id, "username": user.username}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    u = request.user
    return Response(
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "first_name": u.first_name,
            "last_name": u.last_name,
        }
    )


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def events(request):
    if request.method == "GET":
        qs = Event.objects.all().order_by("-created_at")
        return Response(EventSerializer(qs, many=True).data)

    serializer = EventSerializer(data=request.data)
    if serializer.is_valid():
        event = serializer.save(created_by=request.user)
        return Response(EventSerializer(event).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def event_detail(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response({"detail": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return Response(EventSerializer(event).data)

    if event.created_by != request.user:
        return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "PUT":
        serializer = EventSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()  # keeps created_by unchanged
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    event.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)