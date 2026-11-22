from rest_framework import serializers

from .models import Comment, Post


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ("id", "author_name", "body", "created_at")
        read_only_fields = ("id", "author_name", "created_at")

    # E-posta asla dönmez, sadece görünen ad.
    def get_author_name(self, obj):
        return obj.author.get_full_name().strip() or "Üye"


class PostListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ("id", "title", "slug", "summary", "cover_image", "published_at")


class PostDetailSerializer(serializers.ModelSerializer):
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = (
            "id",
            "title",
            "slug",
            "summary",
            "content",
            "cover_image",
            "published_at",
            "comments",
        )

    def get_comments(self, obj):
        approved = obj.comments.filter(is_approved=True).select_related("author")
        return CommentSerializer(approved, many=True).data