from django import forms
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.shortcuts import redirect

from .models import (
    Attribute,
    AttributeOption,
    AttributeGroup,
    Brand,
    Category,
    CategoryAttribute,
    HomepageBand,
    InstallmentOption,
    Product,
    ProductAttributeValue,
    ProductHighlightImage,
    ProductImage,
    ProductResource,
    ProductReview,
    ProductVariant,
    SiteContent,
    Tag,
)



class ProductAttributeValueForm(forms.ModelForm):
    class Meta:
        model = ProductAttributeValue
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        instance = getattr(self, "instance", None)

        if not instance or not instance.attribute_id:
            return

        attribute = instance.attribute

        options = attribute.options.filter(
            is_active=True,
        ).order_by(
            "display_order",
            "value",
        )

        if options.exists():
            choices = [
                ("", "---------"),
            ]

            choices += [
                (option.value, option.value)
                for option in options
            ]

            self.fields["value"] = forms.ChoiceField(
                choices=choices,
                required=False,
                label="Değer",
            )

        elif attribute.data_type == "boolean":
            self.fields["value"] = forms.ChoiceField(
                choices=[
                    ("", "---------"),
                    ("true", "Evet"),
                    ("false", "Hayır"),
                ],
                required=False,
                label="Değer",
            )

        else:
            self.fields["value"] = forms.CharField(
                required=False,
                label="Değer",
                widget=forms.TextInput(
                    attrs={
                        "style": "width: 100%;",
                        "placeholder": "Değer girin",
                    }
                ),
            )

class ProductAttributeValueInline(admin.TabularInline):
    model = ProductAttributeValue
    form = ProductAttributeValueForm
    extra = 0
    can_delete = False
    classes = ("collapse",)

    fields = (
        "attribute_name",
        "value",
    )

    readonly_fields = (
        "attribute_name",
    )

    group_id = None

    def get_queryset(self, request):
        queryset = super().get_queryset(request)

        if self.group_id is not None:
            queryset = queryset.filter(
                attribute__group_id=self.group_id,
            )

        return queryset.select_related(
            "attribute",
            "attribute__group",
        )

    @admin.display(description="Özellik")
    def attribute_name(self, obj):
        if not obj or not obj.attribute_id:
            return "-"

        unit = f" ({obj.attribute.unit})" if obj.attribute.unit else ""
        return f"{obj.attribute.name}{unit}"


def create_attribute_group_inline(group):
    return type(
        f"AttributeGroupInline{group.pk}",
        (ProductAttributeValueInline,),
        {
            "group_id": group.pk,
            "verbose_name": group.name,
            "verbose_name_plural": group.name,
        },
    )


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1

    fields = (
        "sku",
        "color",
        "size",
         "trim",
        "capacity",
        "wheel_size",
        "material",
        "bundle",
        "price",
        "stock_quantity",
        "barcode",
        "is_default",
        "is_active",
    )


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

    fields = (
        "image",
        "image_preview",
        "alt_text",
        "is_primary",
        "display_order",
    )

    readonly_fields = (
        "image_preview",
    )

    @admin.display(description="Önizleme")
    def image_preview(self, obj):
        if obj.pk and obj.image:
            return format_html(
                '<img src="{}" style="width:90px;height:70px;'
                'object-fit:cover;border-radius:8px;" />',
                obj.image.url,
            )

        return "Henüz görsel yok"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "parent",
        "is_active",
        "created_at",
    )

    list_filter = (
        "parent",
        "is_active",
    )

    search_fields = (
        "name",
    )

    prepopulated_fields = {
        "slug": ("name",),
    }

    readonly_fields = (
        "created_at",
        "updated_at",
    )


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "country",
        "founded_year",
        "is_active",
        "created_at",
    )

    list_filter = (
        "country",
        "is_active",
    )

    search_fields = (
        "name",
        "country",
    )

    prepopulated_fields = {
        "slug": ("name",),
    }

    readonly_fields = (
        "created_at",
        "updated_at",
    )


class ProductHighlightImageInline(admin.TabularInline):
    model = ProductHighlightImage
    extra = 1
    fields = ("attribute", "image", "title", "description")

    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)

        queryset = Attribute.objects.none()

        if obj is not None and obj.category_id:
            highlight_attribute_ids = (
                CategoryAttribute.objects
                .filter(
                    category_id=obj.category_id,
                    is_highlight=True,
                )
                .values_list(
                    "attribute_id",
                    flat=True,
                )
            )

            queryset = Attribute.objects.filter(
                id__in=highlight_attribute_ids,
            )

        formset.form.base_fields["attribute"].queryset = queryset # type: ignore

        return formset


class ProductResourceInline(admin.TabularInline):
    model = ProductResource
    extra = 1
    fields = ("title", "file", "display_order")
   
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "brand",
        "category",
        "price",
        "discount_price",
        "is_featured",
        "is_active",
        "created_at",
    )

    list_filter = (
        "brand",
        "category",
        "is_featured",
        "is_active",
    )

    search_fields = (
        "name",
        "brand__name",
        "category__name",
    )

    prepopulated_fields = {
        "slug": ("name",),
    }

    autocomplete_fields = (
        "brand",
        "category",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Temel Ürün Bilgileri",
            {
                "fields": (
                    "name",
                    "slug",
                    "brand",
                    "category",
                    "price",
                    "discount_price",
                ),
            },
        ),
        (
            "İçerik",
            {
                "fields": (
                    "short_description",
                    "description",
                    "cover_image",
                    "instagram_url",
                    "whatsapp_number",
                ),
            },
        ),
        (
            "Yayın Ayarları",
            {
                "fields": (
                    "is_featured",
                    "is_active",
                    "tags",
                ),
            },
        ),
        (
            "Sistem Bilgileri",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                ),
                "classes": (
                    "collapse",
                ),
            },
        ),
    )


    inlines = [ProductHighlightImageInline]

    def get_inline_instances(self, request, obj=None):
        inline_instances = []

        if obj is not None and obj.category_id:
            group_ids = (
                CategoryAttribute.objects
                .filter(
                    category=obj.category,
                )
                .values_list(
                    "attribute__group_id",
                    flat=True,
                )
            )

            groups = (
                AttributeGroup.objects
                .filter(
                    id__in=group_ids,
                )
                .distinct()
                .order_by(
                    "display_order",
                    "name",
                )
            )

            for group in groups:
                inline_class = create_attribute_group_inline(group)
                inline_instances.append(
                    inline_class(
                        self.model,
                        self.admin_site,
                    )
                )

        inline_instances.append(
            ProductVariantInline(
                self.model,
                self.admin_site,
            )
        )

        inline_instances.append(
            ProductImageInline(
                self.model,
                self.admin_site,
            )
        )


        inline_instances.append(
            ProductHighlightImageInline(
                self.model,
                self.admin_site,
            )
        )

        inline_instances.append(
            ProductResourceInline(
                self.model,
                self.admin_site,
            )
        )


        return inline_instances

    def save_related(self, request, form, formsets, change):
        super().save_related(
            request,
            form,
            formsets,
            change,
        )

        product = form.instance

        category_attribute_ids = (
            CategoryAttribute.objects
            .filter(
                category=product.category,
            )
            .values_list(
                "attribute_id",
                flat=True,
            )
        )

        existing_attribute_ids = set(
            ProductAttributeValue.objects
            .filter(
                product=product,
                attribute_id__in=category_attribute_ids,
            )
            .values_list(
                "attribute_id",
                flat=True,
            )
        )

        missing_values = [
            ProductAttributeValue(
                product=product,
                attribute_id=attribute_id,
                value="",
            )
            for attribute_id in category_attribute_ids
            if attribute_id not in existing_attribute_ids
        ]

        ProductAttributeValue.objects.bulk_create(
            missing_values,
            ignore_conflicts=True,
        )


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = (
        "product",
        "sku",
        "color",
        "size",
        "price",
        "stock_quantity",
        "is_default",
        "is_active",
    )

    list_filter = (
        "is_default",
        "is_active",
        "color",
        "size",
    )

    search_fields = (
        "product__name",
        "sku",
        "color",
        "size",
    )

    autocomplete_fields = (
        "product",
    )


@admin.register(AttributeGroup)
class AttributeGroupAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "display_order",
        "is_active",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "name",
    )

    prepopulated_fields = {
        "slug": ("name",),
    }


@admin.register(Attribute)
class AttributeAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "group",
        "data_type",
        "unit",
        "is_filterable",
        "is_comparable",
        "display_order",
    )

    list_filter = (
        "group",
        "data_type",
        "is_filterable",
        "is_comparable",
    )

    search_fields = (
        "name",
    )

    prepopulated_fields = {
        "slug": ("name",),
    }

    autocomplete_fields = (
        "group",
    )


@admin.register(CategoryAttribute)
class CategoryAttributeAdmin(admin.ModelAdmin):
    list_display = (
        "category",
        "attribute",
        "is_required",
        "is_filterable",
        "is_comparable",
        "display_order",
    )

    list_filter = (
        "category",
        "attribute__group",
    )

    autocomplete_fields = (
        "category",
        "attribute",
    )

@admin.register(AttributeOption)
class AttributeOptionAdmin(admin.ModelAdmin):
    list_display = (
        "attribute",
        "value",
        "display_order",
        "is_active",
    )

    list_filter = (
        "attribute",
        "is_active",
    )

    search_fields = (
        "value",
        "attribute__name",
    )

    autocomplete_fields = (
        "attribute",
    )


@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = (
        "product",
        "user",
        "rating",
        "is_approved",
        "created_at",
    )

    list_filter = (
        "is_approved",
        "rating",
    )

    search_fields = (
        "product__name",
        "user__email",
        "comment",
    )

    autocomplete_fields = (
        "product",
        "user",
    )

    readonly_fields = (
        "created_at",
    )

    actions = (
        "approve_reviews",
    )

    @admin.action(description="Seçili yorumları onayla")
    def approve_reviews(self, request, queryset):
        updated_count = queryset.update(is_approved=True)
        self.message_user(
            request,
            f"{updated_count} yorum onaylandı.",
        )
        


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "is_active",
        "created_at",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "name",
    )

    prepopulated_fields = {
        "slug": ("name",),
    }


@admin.register(HomepageBand)
class HomepageBandAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "tag",
        "display_order",
        "is_active",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "title",
    )

    autocomplete_fields = (
        "tag",
    )

@admin.register(SiteContent)
class SiteContentAdmin(admin.ModelAdmin):
    fieldsets = (
        (
            "Sabit Sayfa İçerikleri",
            {
                "fields": (
                    "kargo_teslimat",
                    "iade_degisim",
                    "garanti_bilgisi",
                ),
            },
        ),
    )

    def has_add_permission(self, request):
        return not SiteContent.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        obj = SiteContent.load()
        return redirect(
            reverse(
                "admin:catalog_sitecontent_change",
                args=(obj.pk,),
            )
        )


@admin.register(InstallmentOption)
class InstallmentOptionAdmin(admin.ModelAdmin):
    list_display = (
        "__str__",
        "brand",
        "category",
        "bank_name",
        "installment_count",
        "rate",
        "is_active",
    )

    list_filter = (
        "brand",
        "category",
        "bank_name",
        "is_active",
    )

    search_fields = (
        "bank_name",
    )

    autocomplete_fields = (
        "brand",
        "category",
    )
