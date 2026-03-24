from rest_framework import serializers

from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_avatar = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('id', 'vehicle', 'author', 'author_name', 'author_avatar', 'body', 'created_at')
        read_only_fields = ('id', 'vehicle', 'author', 'author_name', 'author_avatar', 'created_at')

    def get_author_name(self, obj):
        return f'{obj.author.first_name} {obj.author.last_name}'.strip() or obj.author.email

    def get_author_avatar(self, obj):
        request = self.context.get('request')
        if obj.author.avatar and request:
            return request.build_absolute_uri(obj.author.avatar.url)
        return None
