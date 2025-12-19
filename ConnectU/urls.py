from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path("api/auth/register/", views.register, name="register"),
    path("api/auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/me/", views.me, name="me"),

    path("api/events/", views.events, name="events"),
    path("api/events/<int:event_id>/", views.event_detail, name="event_detail"),
    path("api/events/<int:event_id>/join/", views.event_join, name="event_join"),
    path("api/events/<int:event_id>/leave/", views.event_leave, name="event_leave"),

    path("api/groups/", views.groups, name="groups"),
    path("api/groups/<int:group_id>/", views.group_detail, name="group_detail"),
    path("api/groups/<int:group_id>/join/", views.group_join, name="group_join"),
    path("api/groups/<int:group_id>/leave/", views.group_leave, name="group_leave"),

    path("api/dashboard/", views.dashboard, name="dashboard"),
]