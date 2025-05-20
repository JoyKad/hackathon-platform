from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamViewSet, RegisterView, UserTeamsView

router = DefaultRouter()
router.register(r'teams', TeamViewSet, basename='teams')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('my-teams/', UserTeamsView.as_view(), name='my-teams'),
]

