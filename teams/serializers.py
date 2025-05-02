from rest_framework import serializers
from .models import Team
from accounts.models import User  # Кастомный пользователь


# 👤 Сериализатор для участников команды (отображение информации о пользователях)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'user_code']


# 🛠️ Сериализатор для создания и отображения команд
class TeamSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)

    # 📥 Поле для ввода кодов участников (минимум 2, максимум 5)
    members_code_input = serializers.ListField(
        child=serializers.CharField(max_length=8),
        write_only=True,
        required=True,
        min_length=2,
        max_length=5
    )

    class Meta:
        model = Team
        fields = ['id', 'name', 'banner', 'description', 'members', 'members_code_input']
        read_only_fields = ['members']

    def create(self, validated_data):
        request = self.context.get('request')
        captain = request.user if request else None

        # Получаем коды участников, исключая код капитана (если вдруг он указан)
        codes = validated_data.pop('members_code_input', [])
        codes = [code for code in codes if code != captain.user_code]

        # Создаём команду с капитаном
        team = Team.objects.create(captain=captain, **validated_data)

        # Получаем пользователей по кодам и добавляем капитана
        users = list(User.objects.filter(user_code__in=codes))
        if captain:
            users.append(captain)

        team.members.set(users)
        return team


# 🧾 Сериализатор для регистрации пользователя
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'full_name', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password']
        )
        return user
