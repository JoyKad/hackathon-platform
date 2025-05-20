from rest_framework import viewsets, filters, generics, permissions
from rest_framework.response import Response
from .models import Team
from .serializers import TeamSerializer, RegisterSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

    # Добавляем поиск по названию и имени капитана
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'captain__full_name']

    # Передаём request в сериализатор
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class UserTeamsView(generics.ListAPIView):
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Return teams where the user is a member or captain
        """
        user = self.request.user
        return Team.objects.filter(members=user) | Team.objects.filter(captain=user)
