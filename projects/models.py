from django.db import models
from django.core.exceptions import ValidationError
from teams.models import Team


def validate_logo_file(file):
    max_size = 2 * 1024 * 1024  # 2 MB
    valid_mime_types = ['image/jpeg', 'image/png', 'image/svg+xml']

    if file.size > max_size:
        raise ValidationError("Размер файла не должен превышать 2 МБ.")
    if file.content_type not in valid_mime_types:
        raise ValidationError("Допустимые форматы логотипа: JPEG, PNG, SVG.")


class Project(models.Model):
    name = models.CharField(
        max_length=255,
        verbose_name='Название проекта'
    )
    
    description = models.TextField(
        verbose_name='Описание проекта'
    )
    
    team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        related_name='projects',
        verbose_name='Команда'
    )
    
    repository_link = models.URLField(
        blank=True,
        null=True,
        verbose_name='Ссылка на репозиторий'
    )
    
    demo_link = models.URLField(
        blank=True,
        null=True,
        verbose_name='Ссылка на демо'
    )
    
    logo = models.ImageField(
        upload_to='project_logos/',
        validators=[validate_logo_file],
        blank=True,
        null=True,
        verbose_name='Логотип проекта'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата обновления'
    )
    
    class Meta:
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name 