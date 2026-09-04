from django.db import models
from django.conf import settings


class Category(models.Model):
    name = models.CharField(
        max_length=100,
        verbose_name="Kategori Adı",
    )

    slug = models.SlugField(
        max_length=120,
        unique=True,
        verbose_name="Slug",
    )

    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE, # type: ignore
        null=True,
        blank=True,
        related_name="children",
        verbose_name="Üst Kategori",
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name="Aktif mi?",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Oluşturulma Tarihi",
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Güncellenme Tarihi",
    )

    class Meta:
        verbose_name = "Kategori"
        verbose_name_plural = "Kategoriler"
        ordering = ["name"]

    def __str__(self):
        if self.parent:
            return f"{self.parent.name} → {self.name}"
        return self.name


class Brand(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Marka Adı",
    )

    slug = models.SlugField(
        max_length=120,
        unique=True,
        verbose_name="Slug",
    )

    logo = models.ImageField(
        upload_to="brands/",
        null=True,
        blank=True,
        verbose_name="Marka Logosu",
    )

    country = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Ülke",
    )

    founded_year = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        verbose_name="Kuruluş Yılı",
    )

    website = models.URLField(
        blank=True,
        verbose_name="Resmî Web Sitesi",
    )

    description = models.TextField(
        blank=True,
        verbose_name="Açıklama",
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name="Aktif mi?",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Oluşturulma Tarihi",
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Güncellenme Tarihi",
    )

    class Meta:
        verbose_name = "Marka"
        verbose_name_plural = "Markalar"
        ordering = ["name"]

    def __str__(self):
        return self.name


class ProductStockStatus(models.TextChoices):
    IN_STOCK = "in_stock", "Stokta"
    OUT_OF_STOCK = "out_of_stock", "Stokta Yok"
    PRE_ORDER = "pre_order", "Ön Sipariş"
    ON_REQUEST = "on_request", "Sipariş Üzerine"


class ProductCurrency(models.TextChoices):
    TRY = "TRY", "Türk Lirası"
    USD = "USD", "Amerikan Doları"
    EUR = "EUR", "Euro"



class Tag(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Etiket Adı",
    )

    slug = models.SlugField(
        max_length=120,
        unique=True,
        verbose_name="Slug",
    )

    description = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Açıklama",
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name="Aktif mi?",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Oluşturulma Tarihi",
    )

    class Meta:
        verbose_name = "Etiket"
        verbose_name_plural = "Etiketler"
        ordering = ("name",)

    def __str__(self):
        return self.name

class HomepageBand(models.Model):
    title = models.CharField(
        max_length=150,
        verbose_name="Bant Başlığı",
        help_text="Anasayfada görünecek başlık, örn: 'Kampanyalı Ürünler'",
    )

    tag = models.ForeignKey(
        Tag,
        on_delete=models.CASCADE,
        related_name="homepage_bands",
        verbose_name="Etiket",
        help_text="Bu bant, bu etikete sahip ürünleri gösterir.",
    )

    display_order = models.PositiveIntegerField(
        default=0,
        verbose_name="Gösterim Sırası",
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name="Aktif mi?",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Oluşturulma Tarihi",
    )

    class Meta:
        verbose_name = "Anasayfa Bandı"
        verbose_name_plural = "Anasayfa Bantları"
        ordering = ("display_order", "title")

    def __str__(self):
        return self.title

class Product(models.Model):
    name = models.CharField(
        max_length=150,
        verbose_name="Ürün Adı",
    )

    slug = models.SlugField(
        max_length=180,
        unique=True,
        verbose_name="Slug",
    )

    product_code = models.CharField(
        max_length=100,
        unique=True,
        null=True,
        blank=True,
        verbose_name="Ürün Kodu",
    )

    brand = models.ForeignKey(
        Brand,
        on_delete=models.PROTECT,
        related_name="products",
        verbose_name="Marka",
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products",
        verbose_name="Kategori",
    )

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Ana Fiyat",
    )


    discount_price = models.DecimalField(
      max_digits=12,
      decimal_places=2,
      null=True,
      blank=True,
)
    currency = models.CharField(
        max_length=3,
        choices=ProductCurrency.choices,
        default=ProductCurrency.TRY,
        verbose_name="Para Birimi",
    )

    stock_status = models.CharField(
        max_length=20,
        choices=ProductStockStatus.choices,
        default=ProductStockStatus.IN_STOCK,
        verbose_name="Stok Durumu",
    )

    short_description = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Kısa Açıklama",
    )

    description = models.TextField(
        blank=True,
        verbose_name="Ürün Açıklaması",
    )

    instagram_url = models.URLField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name="Instagram Bağlantısı",
    )

    whatsapp_number = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        verbose_name="WhatsApp Numarası",
    )

    cover_image = models.ImageField(
        upload_to="products/",
        null=True,
        blank=True,
        verbose_name="Kapak Görseli",
    )

    is_featured = models.BooleanField(
        default=False,
        verbose_name="Öne Çıkan Ürün mü?",
    )

    tags = models.ManyToManyField(
        Tag,
        blank=True,
        related_name="products",
        verbose_name="Etiketler",
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name="Aktif mi?",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Oluşturulma Tarihi",
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Güncellenme Tarihi",
    )

    class Meta:
        verbose_name = "Ürün"
        verbose_name_plural = "Ürünler"
        ordering = (
            "brand__name",
            "name",
        )

    def __str__(self):
        return f"{self.brand.name} {self.name}"


class Favorite(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="favorites",
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="favorited_by",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "product")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} -> {self.product}"


class ProductReview(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="reviews",
        verbose_name="Ürün",
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="product_reviews",
        verbose_name="Kullanıcı",
    )

    rating = models.PositiveSmallIntegerField(
        verbose_name="Puan",
    )

    comment = models.TextField(
        verbose_name="Yorum",
    )

    is_approved = models.BooleanField(
        default=False,
        verbose_name="Onaylandı mı?",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Oluşturulma Tarihi",
    )

    class Meta:
        verbose_name = "Ürün Yorumu"
        verbose_name_plural = "Ürün Yorumları"
        ordering = ("-created_at",)
        unique_together = ("product", "user")

    def __str__(self):
        return f"{self.product.name} - {self.user} ({self.rating}/5)"


    
class ProductVariant(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="variants",
        verbose_name="Ürün",
    )

    sku = models.CharField(
        max_length=120,
        unique=True,
        verbose_name="Stok Kodu",
    )

    color = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Renk",
    )

    size = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="Beden / Ölçü",
    )

    trim = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Donanım Paketi",
        help_text="Örn: STD, DLX, ABS",
    )

    capacity = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Kapasite / Hacim",
        help_text="Örn: 40Ah, 60Ah, 125cc",
    )

    wheel_size = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="Jant / Teker Boyu",
        help_text="Örn: 26, 27.5, 29",
    )

    material = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Malzeme",
        help_text="Örn: Deri, Kumaş/Mesh",
    )

    bundle = models.CharField(
        max_length=150,
        blank=True,
        verbose_name="Paket İçeriği",
        help_text="Örn: Kask Hediyeli Paket",
    )


    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Varyant Fiyatı",
        help_text=(
            "Boş bırakılırsa ürünün ana fiyatı kullanılır."
        ),
    )

    stock_quantity = models.PositiveIntegerField(
        default=0,
        verbose_name="Stok Adedi",
    )

    barcode = models.CharField(
        max_length=50,
        unique=True,
        null=True,
        blank=True,
        verbose_name="Barkod",
    )

    is_default = models.BooleanField(
        default=False,
        verbose_name="Varsayılan Varyant",
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name="Aktif mi?",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Oluşturulma Tarihi",
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Güncellenme Tarihi",
    )

    class Meta:
        verbose_name = "Ürün Varyantı"
        verbose_name_plural = "Ürün Varyantları"
        ordering = (
            "product",
            "color",
            "size",
            "trim",
            "capacity",
            "wheel_size",
            "material",
            "bundle",
        )

        constraints = [
            models.UniqueConstraint(
                fields=(
                    "product",
                    "color",
                    "size",
                    "trim",
                    "capacity",
                    "wheel_size",
                    "material",
                    "bundle",
                ),
               name="unique_product_variant_combination",
            ),
        ]

    def __str__(self):
        variant_parts = [
            part
            for part in (
                self.color,
                self.size,
                self.trim,
                self.capacity,
                self.wheel_size,
                self.material,
                self.bundle,
            )
            if part
        ]

        if variant_parts:
            return (
                f"{self.product.name} - "
                f"{' / '.join(variant_parts)}"
            )

        return self.product.name

    @property
    def effective_price(self):
        if self.price is not None:
            return self.price

        return self.product.price

    @property
    def is_in_stock(self):
        return self.stock_quantity > 0


class AttributeGroup(models.Model):


    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Özellik Grubu Adı",
    )

    slug = models.SlugField(
        max_length=120,
        unique=True,
        verbose_name="Slug",
    )

    description = models.TextField(
        blank=True,
        verbose_name="Açıklama",
    )

    display_order = models.PositiveIntegerField(
        default=0,
        verbose_name="Gösterim Sırası",
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name="Aktif mi?",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Oluşturulma Tarihi",
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Güncellenme Tarihi",
    )

    class Meta:
        verbose_name = "Özellik Grubu"
        verbose_name_plural = "Özellik Grupları"
        ordering = ["display_order", "name"]

    def __str__(self):
        return self.name

class Attribute(models.Model):
    class DataType(models.TextChoices):
        TEXT = "text", "Metin"
        INTEGER = "integer", "Tam Sayı"
        DECIMAL = "decimal", "Ondalıklı Sayı"
        BOOLEAN = "boolean", "Evet / Hayır"
        SINGLE_SELECT = "single_select", "Tek Seçim"
        MULTI_SELECT = "multi_select", "Çoklu Seçim"

    group = models.ForeignKey(
        AttributeGroup,
        on_delete=models.PROTECT,
        related_name="attributes",
        verbose_name="Özellik Grubu",
    )

    name = models.CharField(
        max_length=120,
        verbose_name="Özellik Adı",
    )

    slug = models.SlugField(
        max_length=140,
        unique=True,
        verbose_name="Slug",
    )

    data_type = models.CharField(
        max_length=20,
        choices=DataType.choices,
        default=DataType.TEXT,
        verbose_name="Veri Tipi",
    )

    unit = models.CharField(
        max_length=30,
        blank=True,
        verbose_name="Birim",
        help_text="Örnek: cc, HP, Nm, kg, litre, km",
    )

    description = models.TextField(
        blank=True,
        verbose_name="Açıklama",
    )

    is_filterable = models.BooleanField(
        default=False,
        verbose_name="Filtrelenebilir mi?",
    )

    is_comparable = models.BooleanField(
        default=False,
        verbose_name="Karşılaştırmada Gösterilsin mi?",
    )

    is_searchable = models.BooleanField(
        default=False,
        verbose_name="Aranabilir mi?",
    )

    display_order = models.PositiveIntegerField(
        default=0,
        verbose_name="Gösterim Sırası",
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name="Aktif mi?",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Oluşturulma Tarihi",
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Güncellenme Tarihi",
    )

    class Meta:
        verbose_name = "Özellik"
        verbose_name_plural = "Özellikler"
        ordering = [
            "group__display_order",
            "display_order",
            "name",
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["group", "name"],
                name="unique_attribute_name_per_group",
            ),
        ]

    def __str__(self):
        return f"{self.group.name} → {self.name}"

class AttributeOption(models.Model):
    attribute = models.ForeignKey(
        Attribute,
        on_delete=models.CASCADE,
        related_name="options",
        verbose_name="Özellik",
    )

    value = models.CharField(
        max_length=120,
        verbose_name="Seçenek",
    )

    display_order = models.PositiveIntegerField(
        default=0,
        verbose_name="Sıralama",
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name="Aktif mi?",
    )

    class Meta:
        verbose_name = "Özellik Seçeneği"
        verbose_name_plural = "Özellik Seçenekleri"
        ordering = (
            "attribute",
            "display_order",
            "value",
        )

        constraints = [
            models.UniqueConstraint(
                fields=(
                    "attribute",
                    "value",
                ),
                name="unique_attribute_option",
            ),
        ]

    def __str__(self):
        return f"{self.attribute.name} - {self.value}"
class CategoryAttribute(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="category_attributes",
        verbose_name="Kategori",
    )

    attribute = models.ForeignKey(
        Attribute,
        on_delete=models.CASCADE,
        related_name="category_attributes",
        verbose_name="Özellik",
    )

    is_required = models.BooleanField(
        default=False,
        verbose_name="Zorunlu mu?",
    )

    is_filterable = models.BooleanField(
        default=False,
        verbose_name="Filtrede Gösterilsin mi?",
    )

    is_comparable = models.BooleanField(
        default=False,
        verbose_name="Karşılaştırmada Gösterilsin mi?",
    )

    is_highlight = models.BooleanField(
        default=False,
        verbose_name="Öne Çıkan Özellik mi?",
    )

    display_order = models.PositiveIntegerField(
        default=0,
        verbose_name="Gösterim Sırası",
    )

    class Meta:
        verbose_name = "Kategori Özelliği"
        verbose_name_plural = "Kategori Özellikleri"
        ordering = [
            "category__name",
            "display_order",
            "attribute__name",
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["category", "attribute"],
                name="unique_attribute_per_category",
            ),
        ]

    def __str__(self):
        return f"{self.category.name} → {self.attribute.name}"

class ProductHighlightImage(models.Model):
    product = models.ForeignKey(
        "Product",
        on_delete=models.CASCADE,
        related_name="highlight_images",
        verbose_name="Ürün",
    )

    attribute = models.ForeignKey(
        Attribute,
        on_delete=models.CASCADE,
        related_name="highlight_images",
        verbose_name="Özellik",
    )

    image = models.ImageField(
        upload_to="products/highlights/",
        verbose_name="Görsel",
    )


    title = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Başlık",
        help_text="Boş bırakılırsa özellik adı (örn: 'Motor Hacmi') kullanılır.",
    )

    description = models.TextField(
        blank=True,
        verbose_name="Kısa Açıklama",
        help_text="1-3 cümlelik editoryal metin (örn: 'Şehir içi kullanım için dengeli güç sunar.')",
    )



    class Meta:
        verbose_name = "Öne Çıkan Özellik Görseli"
        verbose_name_plural = "Öne Çıkan Özellik Görselleri"
        constraints = [
            models.UniqueConstraint(
                fields=["product", "attribute"],
                name="unique_highlight_image_per_product_attribute",
            ),
        ]

    def __str__(self):
        return f"{self.product.name} → {self.attribute.name}"

class ProductAttributeValue(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="attribute_values",
        verbose_name="Ürün",
    )

    attribute = models.ForeignKey(
        Attribute,
        on_delete=models.PROTECT,
        related_name="product_values",
        verbose_name="Özellik",
    )

    value = models.TextField(
        verbose_name="Değer",
    )

    class Meta:
        verbose_name = "Ürün Özelliği"
        verbose_name_plural = "Ürün Özellikleri"
        ordering = [
            "attribute__group__display_order",
            "attribute__display_order",
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["product", "attribute", "value"],
                name="unique_product_attribute_value",
            ),
        ]

    def __str__(self):
        return f"{self.product} | {self.attribute.name}: {self.value}"

class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images",
        verbose_name="Ürün",
    )

    image = models.ImageField(
        upload_to="products/gallery/",
        verbose_name="Ürün Görseli",
    )

    alt_text = models.CharField(
        max_length=180,
        blank=True,
        verbose_name="Alternatif Metin",
        help_text="SEO ve erişilebilirlik için görsel açıklaması.",
    )

    is_primary = models.BooleanField(
        default=False,
        verbose_name="Ana Görsel mi?",
    )

    display_order = models.PositiveIntegerField(
        default=0,
        verbose_name="Gösterim Sırası",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Oluşturulma Tarihi",
    )

    class Meta:
        verbose_name = "Ürün Görseli"
        verbose_name_plural = "Ürün Görselleri"
        ordering = [
            "display_order",
            "id",
        ]

    def __str__(self):
        return f"{self.product} - Görsel {self.display_order}"


class SiteContent(models.Model):
    kargo_teslimat = models.TextField(
        blank=True,
        verbose_name="Kargo ve Teslimat",
    )

    iade_degisim = models.TextField(
        blank=True,
        verbose_name="İade ve Değişim",
    )

    garanti_bilgisi = models.TextField(
        blank=True,
        verbose_name="Garanti Bilgisi",
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Güncellenme Tarihi",
    )

    class Meta:
        verbose_name = "Site İçeriği"
        verbose_name_plural = "Site İçeriği"

    def __str__(self):
        return "Site İçeriği"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

class InstallmentOption(models.Model):
    brand = models.ForeignKey(
        Brand,
        on_delete=models.CASCADE,
        related_name="installment_options",
        null=True,
        blank=True,
        verbose_name="Marka",
        help_text="Boş bırakılırsa markadan bağımsız kural olur.",
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="installment_options",
        null=True,
        blank=True,
        verbose_name="Kategori",
        help_text="Boş bırakılırsa kategoriden bağımsız kural olur.",
    )

    bank_name = models.CharField(
        max_length=100,
        verbose_name="Banka Adı",
        help_text="Örn: Garanti BBVA, Yapı Kredi, Akbank",
    )

    installment_count = models.PositiveIntegerField(
        verbose_name="Taksit Sayısı",
        help_text="Örn: 1 (tek çekim), 2, 3, 6, 9, 12",
    )

    rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        verbose_name="Vade Farkı (%)",
        help_text="Taksitsiz/tek çekim ise 0 girin.",
    )

    display_order = models.PositiveIntegerField(
        default=0,
        verbose_name="Gösterim Sırası",
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name="Aktif mi?",
    )

    class Meta:
        verbose_name = "Taksit Seçeneği"
        verbose_name_plural = "Taksit Seçenekleri"
        ordering = ("brand__name", "category__name", "bank_name", "installment_count")
        constraints = [
            models.UniqueConstraint(
                fields=("brand", "category", "bank_name", "installment_count"),
                name="unique_installment_scope",
            ),
        ]

    def __str__(self):
        scope_parts = [
            part
            for part in (
                self.brand.name if self.brand else None,
                self.category.name if self.category else None,
            )
            if part
        ]

        scope = " / ".join(scope_parts) if scope_parts else "Genel"

        return f"{scope} - {self.bank_name} - {self.installment_count} taksit"


class ProductResource(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="resources",
        verbose_name="Ürün",
    )

    title = models.CharField(
        max_length=150,
        verbose_name="Başlık",
        help_text="Örn: Kullanım Kılavuzu, Temizlik Talimatı",
    )

    file = models.FileField(
        upload_to="products/resources/",
        verbose_name="Dosya",
        help_text="PDF, kullanım kılavuzu, garanti belgesi vb.",
    )

    display_order = models.PositiveIntegerField(
        default=0,
        verbose_name="Gösterim Sırası",
    )

    class Meta:
        verbose_name = "Ürün Kaynağı"
        verbose_name_plural = "Ürün Kaynakları"
        ordering = ("product", "display_order", "title")

    def __str__(self):
        return f"{self.product.name} - {self.title}"