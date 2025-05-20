# accounts/urls.py

from django.urls import path
from .views import (
    RegisterView, 
    UserDetailView, 
    CurrentUserView,
    UserUpdateView,
    AvatarUploadView
)

urlpatterns = [
    # POST → регистрация нового пользователя
    path("register/", RegisterView.as_view(), name="accounts-register"),
    # GET → детали пользователя по ID (включая по user_code)
    path("<int:pk>/", UserDetailView.as_view(), name="accounts-detail"),
    # GET → получение данных текущего пользователя
    path("me/", CurrentUserView.as_view(), name="accounts-current-user"),
    # PUT → обновление данных профиля
    path("update/", UserUpdateView.as_view(), name="accounts-update"),
    # POST → загрузка аватара
    path("upload-avatar/", AvatarUploadView.as_view(), name="accounts-upload-avatar"),
]
