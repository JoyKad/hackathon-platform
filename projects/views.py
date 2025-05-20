from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Project
from .serializers import ProjectSerializer, ProjectCreateSerializer, ProjectDetailSerializer
from teams.models import Team


class ProjectListView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Get all projects from teams where the user is a member
        user_teams = Team.objects.filter(members=self.request.user)
        return Project.objects.filter(team__in=user_teams)


class ProjectDetailView(generics.RetrieveAPIView):
    serializer_class = ProjectDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Project.objects.all()
    
    def get_object(self):
        obj = super().get_object()
        # Check if user is a member of the team that owns this project
        if self.request.user not in obj.team.members.all() and self.request.user != obj.team.captain:
            self.permission_denied(self.request)
        return obj


class ProjectCreateView(generics.CreateAPIView):
    serializer_class = ProjectCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        team = Team.objects.get(id=self.request.data.get('team'))
        
        # Check if the user is the captain of the team
        if self.request.user != team.captain:
            return Response(
                {"detail": "Только капитан команды может создавать проекты"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer.save()


class ProjectUpdateView(generics.UpdateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Project.objects.all()
    
    def get_object(self):
        obj = super().get_object()
        # Check if user is the captain of the team that owns this project
        if self.request.user != obj.team.captain:
            self.permission_denied(self.request)
        return obj


class ProjectDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Project.objects.all()
    
    def get_object(self):
        obj = super().get_object()
        # Check if user is the captain of the team that owns this project
        if self.request.user != obj.team.captain:
            self.permission_denied(self.request)
        return obj 