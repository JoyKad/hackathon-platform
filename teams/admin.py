from django.contrib import admin
from .models import Team
from accounts.models import User  # Импорт кастомного пользователя


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'captain']
    search_fields = ['name', 'description']
    list_filter = ['captain']
    exclude = ['members']
    readonly_fields = ['display_members']

    def display_members(self, obj):
        return ", ".join([f"{user.full_name} ({user.user_code})" for user in obj.members.all()])
    
    display_members.short_description = "Участники команды"

    # Ограничиваем список капитанов участниками команды
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'captain':
            obj_id = request.resolver_match.kwargs.get('object_id')
            if obj_id:
                try:
                    team = Team.objects.get(pk=obj_id)
                    kwargs["queryset"] = team.members.all()
                except Team.DoesNotExist:
                    kwargs["queryset"] = User.objects.none()
            else:
                # При создании команды — показывать пустой список
                kwargs["queryset"] = User.objects.none()

        return super().formfield_for_foreignkey(db_field, request, **kwargs)
