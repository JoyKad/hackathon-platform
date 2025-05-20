from django.contrib import admin
from .models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'team', 'created_at', 'updated_at')
    list_filter = ('team', 'created_at')
    search_fields = ('name', 'description', 'team__name')
    readonly_fields = ('created_at', 'updated_at') 