from django.db import models
from django.core.exceptions import ValidationError
from accounts.models import User


# Валидация размера и типа баннера
def validate_banner_file(file):
    max_size = 2 * 1024 * 1024  # 2 MB
    valid_mime_types = ['image/jpeg', 'image/png', 'application/pdf']

    if file.size > max_size:
        raise ValidationError("Размер файла не должен превышать 2 МБ.")
    if file.content_type not in valid_mime_types:
        raise ValidationError("Допустимые форматы баннера: JPEG, PNG, PDF.")


class Team(models.Model):
    name = models.CharField(
        max_length=255,
        unique=True,
        error_messages={
            'unique': 'Команда с таким названием уже существует.'
        },
        verbose_name='Название'
    )
    
    banner = models.FileField(
        upload_to='banners/',
        validators=[validate_banner_file],
        null=True,
        blank=True,
        verbose_name='Баннер'
    )
    
    members = models.ManyToManyField(
        User,
        related_name='teams',
        blank=True,
        verbose_name='Участники команды'
    )
    
    captain = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='captained_teams',
        verbose_name='Капитан'
    )
    
    description = models.TextField(
        blank=True,
        verbose_name='Описание команды'
    )

    def __str__(self):
        return self.name
