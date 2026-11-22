from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions

from .models import Post
from .serializers import (
    CommentSerializer,
    PostDetailSerializer,
    PostListSerializer,
)


class PostListAPIView(generics.ListAPIView):
    serializer_class = PostListSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        return Post.objects.filter(is_published=True).order_by(
            "-published_at", "-created_at"
        )


class PostDetailAPIView(generics.RetrieveAPIView):
    serializer_class = PostDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return Post.objects.filter(is_published=True)


class PostCommentCreateAPIView(generics.CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        post = get_object_or_404(Post, slug=self.kwargs["slug"], is_published=True)
        # Yorumlar varsayılan olarak onaysız kaydedilir, admin onaylar.
        serializer.save(post=post, author=self.request.user, is_approved=False)