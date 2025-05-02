from rest_framework import generics
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer
from .models import User
from rest_framework.response import Response
from rest_framework import status

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def get(self, request, *args, **kwargs):
        return Response({"detail": "Метод GET не поддерживается."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
