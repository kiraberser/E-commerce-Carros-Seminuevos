from django.contrib import admin

from .models import Comment


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'vehicle', 'created_at')
    search_fields = ('author__email', 'body')
    list_filter = ('created_at',)
