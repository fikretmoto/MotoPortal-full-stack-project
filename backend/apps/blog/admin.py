from django.contrib import admin

from .models import Comment, Post


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "is_published", "published_at", "updated_at")
    list_filter = ("is_published",)
    list_editable = ("is_published",)
    search_fields = ("title", "summary", "content")
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        (None, {"fields": ("title", "slug", "summary", "cover_image", "content")}),
        ("Yayın", {"fields": ("is_published", "published_at")}),
        ("Tarihler", {"fields": ("created_at", "updated_at")}),
    )


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("author", "post", "short_body", "is_approved", "created_at")
    list_filter = ("is_approved", "created_at")
    search_fields = ("body", "post__title")
    actions = ("approve_comments", "unapprove_comments")

    @admin.display(description="Yorum")
    def short_body(self, obj):
        return obj.body[:60]

    @admin.action(description="Seçili yorumları onayla")
    def approve_comments(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f"{updated} yorum onaylandı.")

    @admin.action(description="Seçili yorumların onayını kaldır")
    def unapprove_comments(self, request, queryset):
        updated = queryset.update(is_approved=False)
        self.message_user(request, f"{updated} yorumun onayı kaldırıldı.")