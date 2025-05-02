from django.urls import path
from .views import RegisterView  # если ты уже создал вьюху

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
]
