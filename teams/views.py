from rest_framework import viewsets, filters, generics
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
