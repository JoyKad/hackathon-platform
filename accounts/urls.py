# accounts/urls.py

from django.urls import path
from .views import RegisterView, UserDetailView

urlpatterns = [
    # GET  → список всех пользователей
    path('register/', RegisterView.as_view(), name='accounts_register'),
    # POST → регистрация нового
    path('register/', RegisterView.as_view(), name='accounts-register'),
    # GET /register/123/ → детали пользователя с pk=123
    path('register/<int:pk>/', UserDetailView.as_view(), name='accounts-register-detail'),
]