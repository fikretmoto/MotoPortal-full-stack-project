from django.urls import path

from .views import PostCommentCreateAPIView, PostDetailAPIView, PostListAPIView


app_name = "blog"


urlpatterns = [
    path(
        "blog/",
        PostListAPIView.as_view(),
        name="post-list",
    ),
    path(
        "blog/<slug:slug>/",
        PostDetailAPIView.as_view(),
        name="post-detail",
    ),
    path(
        "blog/<slug:slug>/comments/",
        PostCommentCreateAPIView.as_view(),
        name="post-comment-create",
    ),
]