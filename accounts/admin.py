from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

class UserAdmin(BaseUserAdmin):
    model = User
    list_display = ('email', 'full_name', 'user_code', 'is_staff', 'is_active', 'get_teams')
    list_filter = ('is_staff', 'is_active')
    search_fields = ('email', 'full_name', 'user_code')
    ordering = ('email',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('full_name',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )

    def get_teams(self, obj):
        return ", ".join(team.name for team in obj.teams.all())
    get_teams.short_description = 'Команды'

admin.site.register(User, UserAdmin)
