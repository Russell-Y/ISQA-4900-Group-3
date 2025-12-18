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
]