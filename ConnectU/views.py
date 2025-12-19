from django.shortcuts import render
from django.views import View

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import RegisterSerializer
from .models import Event
from .event_serializers import EventSerializer
from .models import Group
from .group_serializers import GroupSerializer


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
        return Response(EventSerializer(qs, many=True, context={"request": request}).data)

    serializer = EventSerializer(data=request.data)
    if serializer.is_valid():
        event = serializer.save(created_by=request.user)
        return Response(EventSerializer(event, context={"request": request}).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def event_detail(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response({"detail": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return Response(EventSerializer(event, context={"request": request}).data)

    if event.created_by != request.user:
        return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "PUT":
        serializer = EventSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(EventSerializer(event, context={"request": request}).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    event.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def groups(request):
    if request.method == "GET":
        qs = Group.objects.all().order_by("-created_at")
        serializer = GroupSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)

    if request.method == "POST":
        name = request.data.get("name", "").strip()
        description = request.data.get("description", "").strip()
        category = request.data.get("category", "").strip()

        if not name:
            return Response({"detail": "Group name is required."}, status=status.HTTP_400_BAD_REQUEST)

        g = Group.objects.create(
            name=name,
            description=description,
            category=category,
            created_by=request.user,
        )
        g.members.add(request.user)

        serializer = GroupSerializer(g, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def group_join(request, group_id):
    try:
        g = Group.objects.get(id=group_id)
    except Group.DoesNotExist:
        return Response({"detail": "Group not found."}, status=status.HTTP_404_NOT_FOUND)

    g.members.add(request.user)
    serializer = GroupSerializer(g, context={"request": request})
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def group_leave(request, group_id):
    try:
        g = Group.objects.get(id=group_id)
    except Group.DoesNotExist:
        return Response({"detail": "Group not found."}, status=status.HTTP_404_NOT_FOUND)

    g.members.remove(request.user)
    serializer = GroupSerializer(g, context={"request": request})
    return Response(serializer.data)

@api_view(["GET", "PUT", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def group_detail(request, group_id):
    try:
        g = Group.objects.get(id=group_id)
    except Group.DoesNotExist:
        return Response({"detail": "Group not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return Response(GroupSerializer(g, context={"request": request}).data)

    if g.created_by != request.user:
        return Response({"detail": "Only the group creator can modify this group."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "DELETE":
        g.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    data = request.data
    if "name" in data:
        g.name = (data.get("name") or "").strip()
    if "category" in data:
        g.category = (data.get("category") or "").strip()
    if "description" in data:
        g.description = (data.get("description") or "").strip()

    if not g.name:
        return Response({"detail": "Group name is required."}, status=status.HTTP_400_BAD_REQUEST)

    g.save()
    return Response(GroupSerializer(g, context={"request": request}).data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard(request):
    my_groups = Group.objects.filter(members=request.user).order_by("-created_at")
    groups_data = GroupSerializer(my_groups, many=True, context={"request": request}).data

    from .models import Event
    from .serializers import EventSerializer

    if hasattr(Event, "attendees"):
        my_events = Event.objects.filter(attendees=request.user).order_by("-date")
    elif hasattr(Event, "participants"):
        my_events = Event.objects.filter(participants=request.user).order_by("-date")
    else:
        my_events = Event.objects.all().order_by("-date")

    events_data = EventSerializer(my_events, many=True).data

    return Response({
        "groups": groups_data,
        "events": events_data,
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard(request):
    my_groups = Group.objects.filter(members=request.user).order_by("-created_at")
    groups_data = GroupSerializer(my_groups, many=True, context={"request": request}).data

    my_events = Event.objects.filter(attendees=request.user).order_by("-created_at")
    events_data = EventSerializer(my_events, many=True).data

    return Response({
        "groups": groups_data,
        "events": events_data,
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def event_join(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response({"detail": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

    event.attendees.add(request.user)
    return Response({"detail": "Joined"})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def event_leave(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response({"detail": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

    event.attendees.remove(request.user)
    return Response({"detail": "Left"})