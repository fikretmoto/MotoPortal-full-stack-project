from rest_framework import serializers

from .models import (
    AttributeGroup,
    AttributeOption,
    Brand,
    Category,
    CategoryAttribute,
    Product,
    ProductAttributeValue,
    ProductImage,
    ProductVariant,

)


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
        )


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
            "price",
            "effective_price",
            "stock_quantity",
            "barcode",
            "is_default",
            "is_active",
            "is_in_stock",
        )
class ProductListSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    cover_image_url = serializers.SerializerMethodField()

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


class ProductDetailSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)

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
            "currency",
            "stock_status",

            "short_description",
            "description",

            "cover_image_url",
            "images",
            "variants",
            "attributes",

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
            "cover_image",
            "is_featured",
            "is_active",
        )
        read_only_fields = (
            "id",
        )

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

        return attrs
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