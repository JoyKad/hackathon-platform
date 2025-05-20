from rest_framework import generics, permissions
from .serializers import (
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    UserSerializer,
    UserUpdateSerializer,
    AvatarUploadSerializer,
)
from .models import User
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.parsers import MultiPartParser, FormParser
import os


User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def get(self, request, *args, **kwargs):
        return Response(
            {"detail": "Метод GET не поддерживается."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )


from rest_framework_simplejwt.views import TokenObtainPairView


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserDetailView(generics.RetrieveAPIView):

    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "pk"  # можно также 'id'


class CurrentUserView(generics.RetrieveAPIView):
    """
    Получение данных текущего авторизованного пользователя
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserUpdateView(generics.UpdateAPIView):
    """
    Обновление данных текущего пользователя
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserUpdateSerializer

    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Возвращаем обновленные данные пользователя
        response_serializer = UserSerializer(instance)
        return Response(response_serializer.data)


class AvatarUploadView(generics.GenericAPIView):
    """
    Загрузка аватара пользователя
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AvatarUploadSerializer
    parser_classes = [MultiPartParser, FormParser]
    
    def get_object(self):
        return self.request.user
    
    def post(self, request, *args, **kwargs):
        user = self.get_object()
        
        # Удаляем старый аватар, если он существует
        if user.avatar:
            if os.path.isfile(user.avatar.path):
                os.remove(user.avatar.path)
        
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # Возвращаем полные данные пользователя
        response_serializer = UserSerializer(user)
        return Response(response_serializer.data)
