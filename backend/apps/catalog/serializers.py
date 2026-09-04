from decimal import Decimal, InvalidOperation
from datetime import timedelta
from django.utils import timezone

from django.db import transaction
from django.db.models import Prefetch
from rest_framework import serializers

from .models import (
    Attribute,
    AttributeGroup,
    AttributeOption,
    Brand,
    Category,
    CategoryAttribute,
    Favorite,
    Product,
    ProductAttributeValue,
    ProductImage,
    ProductVariant,
    ProductReview,
    ProductHighlightImage,
    HomepageBand,
    SiteContent,
    InstallmentOption,
    ProductResource,
)



NEW_PRODUCT_DAYS = 14
LOW_STOCK_THRESHOLD = 3

TAG_BADGE_NAMES = {
    "Öne Çıkan": "featured",
    "Editörün Seçtikleri": "editors_pick",
    "Fırsat": "deal",
     "Takas Fırsatı": "trade_opportunity",
     "Ücretsiz Kargo": "free_shipping",
}



class ProductBadgeMixin:
    def get_badges(self, obj):
        badges = []

        if obj.created_at >= timezone.now() - timedelta(days=NEW_PRODUCT_DAYS):
            badges.append({"type": "new", "label": "Yeni"})

        if obj.discount_price and obj.price and obj.discount_price < obj.price:
            percentage = round(
                (1 - (obj.discount_price / obj.price)) * 100
            )
            badges.append({
                "type": "discount",
                "label": f"%{percentage} İndirim",
            })

        variant_stock = sum(
            variant.stock_quantity
            for variant in obj.variants.all()
        ) if obj.variants.exists() else None

        total_stock = variant_stock if variant_stock is not None else None

        if obj.stock_status == "out_of_stock":
            badges.append({"type": "out_of_stock", "label": "Tükendi"})
        elif total_stock is not None and 0 < total_stock <= LOW_STOCK_THRESHOLD:
            badges.append({
                "type": "low_stock",
                "label": f"Son {total_stock} Adet",
            })

        for tag in obj.tags.all():
            badge_type = TAG_BADGE_NAMES.get(tag.name)
            if badge_type:
                badges.append({"type": badge_type, "label": tag.name})

        has_zero_rate_installment = InstallmentOption.objects.filter(
            rate=0,
        ).exists()

        if has_zero_rate_installment:
            badges.append({
                "type": "installment_deal",
                "label": "Taksit Fırsatı",
            })


        return badges




class ProductRatingMixin:
    def get_average_rating(self, obj):
        reviews = obj.reviews.filter(is_approved=True)

        if not reviews.exists():
            return None

        total = sum(review.rating for review in reviews)
        return round(total / reviews.count(), 1)

    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()
    



class ProductFavoriteMixin:
    def get_is_favorited(self, obj):
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return False

        return Favorite.objects.filter(
            user=request.user,
            product=obj,
        ).exists()

class CategorySerializer(serializers.ModelSerializer):
    parent_name = serializers.CharField(
        source="parent.name",
        read_only=True,
    )

    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            "slug",
            "parent",
            "parent_name",
            "is_active",
        )


class BrandSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Brand
        fields = (
            "id",
            "name",
            "slug",
            "logo_url",
            "country",
            "founded_year",
            "website",
            "description",
            "is_active",
        )

    def get_logo_url(self, obj):
        if not obj.logo:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(obj.logo.url)

        return obj.logo.url


class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = (
            "id",
            "image_url",
            "alt_text",
            "is_primary",
            "display_order",
        )

    def get_image_url(self, obj):
        if not obj.image:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(obj.image.url)

        return obj.image.url


class ProductAttributeValueSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        source="attribute.name",
        read_only=True,
    )

    slug = serializers.CharField(
        source="attribute.slug",
        read_only=True,
    )

    unit = serializers.CharField(
        source="attribute.unit",
        read_only=True,
    )

    data_type = serializers.CharField(
        source="attribute.data_type",
        read_only=True,
    )

    group = serializers.CharField(
        source="attribute.group.name",
        read_only=True,
    )

    group_slug = serializers.CharField(
        source="attribute.group.slug",
        read_only=True,
    )

    group_order = serializers.IntegerField(
        source="attribute.group.display_order",
        read_only=True,
    )

    attribute_order = serializers.IntegerField(
        source="attribute.display_order",
        read_only=True,
    )

    is_highlight = serializers.SerializerMethodField()
    highlight_image_url = serializers.SerializerMethodField()
    highlight_title = serializers.SerializerMethodField()
    highlight_description = serializers.SerializerMethodField()

    class Meta:
        model = ProductAttributeValue
        fields = (
            "id",
            "group",
            "group_slug",
            "group_order",
            "name",
            "slug",
            "data_type",
            "value",
            "unit",
            "attribute_order",
            "is_highlight",
            "highlight_image_url",
            "highlight_title",
            "highlight_description",
        )

    def _get_highlight_image(self, obj):
        return ProductHighlightImage.objects.filter(
            product=obj.product,
            attribute=obj.attribute,
        ).first()

    def get_is_highlight(self, obj):
        category_attribute = CategoryAttribute.objects.filter(
            category=obj.product.category,
            attribute=obj.attribute,
        ).first()

        if category_attribute is None:
            return False

        return category_attribute.is_highlight

    def get_highlight_image_url(self, obj):
        highlight_image = self._get_highlight_image(obj)

        if highlight_image is None or not highlight_image.image:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(
                highlight_image.image.url
            )

        return highlight_image.image.url

    def get_highlight_title(self, obj):
        highlight_image = self._get_highlight_image(obj)

        if highlight_image and highlight_image.title:
            return highlight_image.title

        return obj.attribute.name

    def get_highlight_description(self, obj):
        highlight_image = self._get_highlight_image(obj)

        if highlight_image and highlight_image.description:
            return highlight_image.description

        if obj.value:
            return f"{obj.value} {obj.attribute.unit}".strip()

        return ""


    
class ProductVariantSerializer(serializers.ModelSerializer):
    effective_price = serializers.ReadOnlyField()
    is_in_stock = serializers.ReadOnlyField()

    class Meta:
        model = ProductVariant
        fields = (
            "id",
            "sku",
            "color",
            "size",
            "trim",
            "capacity",
            "wheel_size",
            "material",
            "bundle",
            "price",
            "effective_price",
            "stock_quantity",
            "is_default",
            "is_active",
            "is_in_stock",
        )

    







class ProductListSerializer(ProductBadgeMixin, ProductRatingMixin, ProductFavoriteMixin, serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    cover_image_url = serializers.SerializerMethodField()
    badges = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    is_favorited = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "slug",
            "brand",
            "category",
            "short_description",
            "cover_image_url",
            "is_featured",
            "is_active",
            "price",
            "currency",
            "stock_status",
            "badges",
            "average_rating",
            "review_count",
            "is_favorited",
        )

    def get_cover_image_url(self, obj):
        if not obj.cover_image:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(
                obj.cover_image.url
            )

        return obj.cover_image.url


class HomepageBandSerializer(serializers.ModelSerializer):
    products = serializers.SerializerMethodField()

    class Meta:
        model = HomepageBand
        fields = (
            "id",
            "title",
            "display_order",
            "products",
        )

    def get_products(self, obj):
        products = (
            obj.tag.products
            .filter(is_active=True)
            .select_related("brand", "category")
            [:12]
        )

        return ProductListSerializer(
            products,
            many=True,
            context=self.context,
        ).data


class ProductResourceSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductResource
        fields = (
            "id",
            "title",
            "file_url",
            "display_order",
        )

    def get_file_url(self, obj):
        if not obj.file:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(obj.file.url)

        return obj.file.url

class ProductDetailSerializer(ProductBadgeMixin, ProductFavoriteMixin, serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    badges = serializers.SerializerMethodField()
    is_favorited = serializers.SerializerMethodField()
   

    images = ProductImageSerializer(
        many=True,
        read_only=True,
    )

    variants = ProductVariantSerializer(
        many=True,
        read_only=True,
    )

    attributes = ProductAttributeValueSerializer(
        source="attribute_values",
        many=True,
        read_only=True,
    )


    resources = ProductResourceSerializer(
        many=True,
        read_only=True,
    )
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "slug",
            "brand",
            "category",

            "price",
            "discount_price",
            "currency",
            "stock_status",

            "short_description",
            "description",
            "instagram_url",
            "whatsapp_number",

            "cover_image_url",
            "images",
            "variants",
            "attributes",
            "resources",
            "badges",
            "is_favorited",

            "is_featured",
            "is_active",
            "created_at",
            "updated_at",
            
        )

    def get_cover_image_url(self, obj):
        if not obj.cover_image:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(
                obj.cover_image.url
            )

        return obj.cover_image.url


class ProductWriteSerializer(serializers.ModelSerializer):
    attributes = serializers.DictField(
        child=serializers.JSONField(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "slug",
            "brand",
            "category",
            "product_code",
            "price",
            "discount_price",
            "currency",
            "stock_status",
            "short_description",
            "description",
            "instagram_url",
            "whatsapp_number",
            "cover_image",
            "is_featured",
            "is_active",
            "attributes",
        )
        read_only_fields = (
            "id",
        )


    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["attributes"] = self.get_current_attribute_values(instance)
        return data

    def get_current_attribute_values(self, instance):
        values: dict[str, Any] = {}

        attribute_values = (
            instance.attribute_values
            .select_related("attribute")
            .order_by(
                "attribute__group__display_order",
                "attribute__display_order",
                "id",
            )
        )

        for attribute_value in attribute_values:
            attribute = attribute_value.attribute

            if attribute.data_type == Attribute.DataType.MULTI_SELECT:
                values.setdefault(attribute.slug, []).append(
                    attribute_value.value
                )
            else:
                values[attribute.slug] = attribute_value.value

        return values

    def validate(self, attrs):
        price = attrs.get(
            "price",
            getattr(self.instance, "price", None),
        )
        discount_price = attrs.get(
            "discount_price",
            getattr(self.instance, "discount_price", None),
        )

        if (
            price is not None
            and discount_price is not None
            and discount_price >= price
        ):
            raise serializers.ValidationError(
                {
                    "discount_price": (
                        "İndirimli fiyat, normal fiyattan düşük olmalı."
                    ),
                }
            )

        raw_attributes = attrs.get("attributes")

        if raw_attributes is not None:
            category = attrs.get(
                "category",
                getattr(self.instance, "category", None),
            )

            if category is None:
                raise serializers.ValidationError(
                    {
                        "attributes": (
                            "Özellik girebilmek için önce kategori "
                            "seçilmiş olmalı."
                        ),
                    }
                )

            attrs["attributes"] = self.validate_attribute_payload(
                category=category,
                raw_attributes=raw_attributes,
            )

        return attrs

    def validate_attribute_payload(self, *, category, raw_attributes):
        category_attributes = (
            CategoryAttribute.objects
            .filter(category=category)
            .select_related("attribute")
            .prefetch_related(
                Prefetch(
                    "attribute__options",
                    queryset=AttributeOption.objects.filter(
                        is_active=True,
                    ),
                )
            )
        )

        category_attributes_by_slug = {
            category_attribute.attribute.slug: category_attribute
            for category_attribute in category_attributes
        }

        resolved: dict[int, dict] = {}

        for attribute_slug, raw_value in raw_attributes.items():
            category_attribute = category_attributes_by_slug.get(
                attribute_slug
            )

            if category_attribute is None:
                raise serializers.ValidationError(
                    {
                        "attributes": (
                            f"'{attribute_slug}' bu kategoriye atanmış "
                            "bir özellik değil."
                        ),
                    }
                )

            attribute = category_attribute.attribute

            resolved[attribute.id] = {
                "data_type": attribute.data_type,
                "values": self.normalize_attribute_value(
                    attribute=attribute,
                    raw_value=raw_value,
                ),
            }

        return resolved

    def normalize_attribute_value(self, *, attribute, raw_value):
        data_type = attribute.data_type

        if data_type == Attribute.DataType.MULTI_SELECT:
            if not isinstance(raw_value, list):
                raise serializers.ValidationError(
                    {
                        "attributes": (
                            f"'{attribute.slug}' için değerler bir "
                            "liste olmalı."
                        ),
                    }
                )

            option_lookup = {
                option.value.strip().casefold(): option.value
                for option in attribute.options.all()
            }

            resolved_values: list[str] = []
            seen_values: set[str] = set()

            for item in raw_value:
                lookup_key = str(item).strip().casefold()
                resolved_option = option_lookup.get(lookup_key)

                if resolved_option is None:
                    raise serializers.ValidationError(
                        {
                            "attributes": (
                                f"'{attribute.slug}' için geçersiz "
                                f"seçenek: {item}"
                            ),
                        }
                    )

                if resolved_option in seen_values:
                    continue

                seen_values.add(resolved_option)
                resolved_values.append(resolved_option)

            if not resolved_values:
                raise serializers.ValidationError(
                    {
                        "attributes": (
                            f"'{attribute.slug}' için en az bir "
                            "geçerli değer girilmeli."
                        ),
                    }
                )

            return resolved_values

        if data_type == Attribute.DataType.SINGLE_SELECT:
            option_lookup = {
                option.value.strip().casefold(): option.value
                for option in attribute.options.all()
            }

            lookup_key = str(raw_value).strip().casefold()
            resolved_option = option_lookup.get(lookup_key)

            if resolved_option is None:
                raise serializers.ValidationError(
                    {
                        "attributes": (
                            f"'{attribute.slug}' için geçersiz "
                            f"seçenek: {raw_value}"
                        ),
                    }
                )

            return [resolved_option]

        if data_type == Attribute.DataType.BOOLEAN:
            if isinstance(raw_value, bool):
                return ["true" if raw_value else "false"]

            normalized = str(raw_value).strip().casefold()

            if normalized in {"true", "1", "evet", "var"}:
                return ["true"]

            if normalized in {"false", "0", "hayir", "hayır", "yok"}:
                return ["false"]

            raise serializers.ValidationError(
                {
                    "attributes": (
                        f"'{attribute.slug}' için geçersiz boolean "
                        f"değer: {raw_value}"
                    ),
                }
            )

        if data_type == Attribute.DataType.INTEGER:
            try:
                return [str(int(raw_value))]
            except (TypeError, ValueError):
                raise serializers.ValidationError(
                    {
                        "attributes": (
                            f"'{attribute.slug}' için geçersiz tam "
                            f"sayı: {raw_value}"
                        ),
                    }
                )

        if data_type == Attribute.DataType.DECIMAL:
            try:
                decimal_value = Decimal(str(raw_value))
            except (InvalidOperation, TypeError):
                raise serializers.ValidationError(
                    {
                        "attributes": (
                            f"'{attribute.slug}' için geçersiz "
                            f"ondalık sayı: {raw_value}"
                        ),
                    }
                )

            formatted = format(decimal_value, "f")
            if "." in formatted:
                formatted = formatted.rstrip("0").rstrip(".")

            return [formatted or "0"]

        # TEXT
        return [str(raw_value)]

    def create(self, validated_data):
        attribute_updates = validated_data.pop("attributes", None)
        product = super().create(validated_data)

        if attribute_updates:
            self.apply_attribute_updates(product, attribute_updates)

        return product

    def update(self, instance, validated_data):
        attribute_updates = validated_data.pop("attributes", None)
        product = super().update(instance, validated_data)

        if attribute_updates:
            self.apply_attribute_updates(product, attribute_updates)

        return product

    def apply_attribute_updates(self, product, attribute_updates):
        with transaction.atomic():
            for attribute_id, payload in attribute_updates.items():
                if payload["data_type"] == Attribute.DataType.MULTI_SELECT:
                    self.apply_multi_select_values(
                        product=product,
                        attribute_id=attribute_id,
                        values=payload["values"],
                    )
                else:
                    self.apply_single_value(
                        product=product,
                        attribute_id=attribute_id,
                        value=payload["values"][0],
                    )

    def apply_single_value(self, *, product, attribute_id, value):
        existing_ids = list(
            ProductAttributeValue.objects
            .filter(
                product=product,
                attribute_id=attribute_id,
            )
            .order_by("id")
            .values_list("id", flat=True)
        )

        if not existing_ids:
            ProductAttributeValue.objects.create(
                product=product,
                attribute_id=attribute_id,
                value=value,
            )
            return

        keep_id = existing_ids[0]
        ProductAttributeValue.objects.filter(
            id=keep_id,
        ).update(value=value)

        extra_ids = existing_ids[1:]
        if extra_ids:
            ProductAttributeValue.objects.filter(
                id__in=extra_ids,
            ).delete()

    def apply_multi_select_values(self, *, product, attribute_id, values):
        ProductAttributeValue.objects.filter(
            product=product,
            attribute_id=attribute_id,
        ).delete()

        ProductAttributeValue.objects.bulk_create(
            [
                ProductAttributeValue(
                    product=product,
                    attribute_id=attribute_id,
                    value=value,
                )
                for value in values
            ]
        )


class ProductReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = (
            "id",
            "product",
            "user",
            "rating",
            "comment",
            "is_approved",
            "created_at",
        )
        read_only_fields = (
            "id",
            "user",
            "is_approved",
            "created_at",
        )

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError(
                "Puan 1 ile 5 arasında olmalı."
            )
        return value

    
class AttributeOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttributeOption
        fields = (
            "id",
            "value",
        )


class CategoryAttributeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(
        source="attribute.id",
        read_only=True,
    )

    slug = serializers.CharField(
        source="attribute.slug",
        read_only=True,
    )

    name = serializers.CharField(
        source="attribute.name",
        read_only=True,
    )

    data_type = serializers.CharField(
        source="attribute.data_type",
        read_only=True,
    )

    unit = serializers.CharField(
        source="attribute.unit",
        read_only=True,
    )

    display_order = serializers.IntegerField(
        read_only=True,
    )

    options = serializers.SerializerMethodField()

    class Meta:
        model = CategoryAttribute
        fields = (
            "id",
            "slug",
            "name",
            "data_type",
            "unit",
            "is_required",
            "is_filterable",
            "display_order",
            "options",
        )

    def get_options(self, obj):
        active_options = obj.attribute.options.all()

        return AttributeOptionSerializer(
        active_options,
        many=True,
    ).data




class SiteContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteContent
        fields = (
            "kargo_teslimat",
            "iade_degisim",
            "garanti_bilgisi",
        )


class InstallmentOptionSerializer(serializers.ModelSerializer):
    brand_slug = serializers.CharField(
        source="brand.slug",
        read_only=True,
        allow_null=True,
    )

    category_slug = serializers.CharField(
        source="category.slug",
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = InstallmentOption
        fields = (
            "id",
            "brand_slug",
            "category_slug",
            "bank_name",
            "installment_count",
            "rate",
            "display_order",
        )


class AttributeGroupWithAttributesSerializer(serializers.Serializer):
    name = serializers.CharField()
    slug = serializers.CharField()
    display_order = serializers.IntegerField()
    attributes = CategoryAttributeSerializer(
        many=True,
    )


class CategoryAttributesResponseSerializer(serializers.Serializer):
    category = CategorySerializer()
    attribute_groups = AttributeGroupWithAttributesSerializer(
        many=True,
    )


class FavoriteSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = (
            "id",
            "product",
            "created_at",
        )
        read_only_fields = (
            "id",
            "product",
            "created_at",
        )