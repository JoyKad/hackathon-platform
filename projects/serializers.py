from rest_framework import serializers
from .models import Project
from teams.serializers import TeamSerializer


class ProjectSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'team', 'team_name',
            'repository_link', 'demo_link', 'logo',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'name', 'description', 'team',
            'repository_link', 'demo_link', 'logo'
        ]


class ProjectDetailSerializer(serializers.ModelSerializer):
    team = TeamSerializer(read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'team',
            'repository_link', 'demo_link', 'logo',
            'created_at', 'updated_at'
        ] 