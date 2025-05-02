from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamViewSet
from .views import RegisterView

router = DefaultRouter()
router.register(r'teams', TeamViewSet, basename='teams')

urlpatterns = [
    path('', include(router.urls)),
]


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
]

