from django.conf import settings
from django.db import models
from django.utils.text import slugify

class Post(models.Model):
    title = models.CharField(max_length=200, verbose_name="Başlık")
    slug = models.SlugField(
        max_length=220,
        unique=True,
        blank=True,
        verbose_name="Slug",
    )
    summary = models.CharField(max_length=300, blank=True, verbose_name="Özet")
    content = models.TextField(verbose_name="İçerik")
    cover_image = models.ImageField(
        upload_to="blog/covers/",
        blank=True,
        null=True,
        verbose_name="Kapak Görseli",
    )
    is_published = models.BooleanField(default=False, verbose_name="Yayında mı?")
    published_at = models.DateTimeField(
        null=True, blank=True, verbose_name="Yayın Tarihi"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Blog Yazısı"
        verbose_name_plural = "Blog Yazıları"
        ordering = ["-published_at", "-created_at"]


    def save(self, *args, **kwargs):
        if not self.slug:
            # slugify noktasız ı harfini düşürdüğü için önce onu i'ye çeviriyoruz
            base = self.title.translate(str.maketrans({"ı": "i", "İ": "I"}))
            base_slug = slugify(base)
            slug = base_slug
            counter = 2
            # Aynı başlıkla ikinci yazı gelirse slug'a -2, -3 gibi ek koyuyoruz
            while Post.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
    def __str__(self):
        return self.title


class Comment(models.Model):
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="comments",
        verbose_name="Yazı",
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="blog_comments",
        verbose_name="Yazar",
    )
    body = models.TextField(verbose_name="Yorum")
    is_approved = models.BooleanField(default=False, verbose_name="Onaylı mı?")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Yorum"
        verbose_name_plural = "Yorumlar"
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.author} → {self.post}"
