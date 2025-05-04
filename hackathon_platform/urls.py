

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import permissions

# Swagger via drf-yasg
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from teams.views import TeamViewSet

router = DefaultRouter()
router.register(r'teams', TeamViewSet, basename='team')

schema_view = get_schema_view(
    openapi.Info(
        title="Hackathon Platform API",
        default_version='v1',
        description="Документация API для платформы хакатона",
    ),
    public=False,
    permission_classes=(permissions.IsAdminUser,),
)

urlpatterns = [
    # Админка
    path('admin/', admin.site.urls),

    # Accounts: регистрация и получение данных о пользователе
    path('api/accounts/', include('accounts.urls')),

    # JWT-токены
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # CRUD для команд
    path('api/', include(router.urls)),

    # Документация (Swagger UI и Redoc) — только для суперпользователя
    path('api/docs/',   schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/',  schema_view.with_ui('redoc',  cache_timeout=0), name='schema-redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
