const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL ortam değişkeni tanımlanmamış."
  );
}

export type Category = {
  id: number;
  name: string;
  slug: string;
  parent: number | null;
  parent_name: string | null;
  is_active: boolean;
};


export type Brand = {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  country: string;
  founded_year: number | null;
  website: string;
  description: string;
  is_active: boolean;
};

export type Product = {
  id: number;

  name: string;

  slug: string;

  brand: Brand;

  category: Category;

  short_description: string;

  cover_image_url: string | null;

  is_featured: boolean;

  is_active: boolean;
};

export type ProductVariant = {
  id: number;
  sku: string;
  color: string;
  size: string;
  price: string | null;
  effective_price: string | null;
  stock_quantity: number;
  barcode: string | null;
  is_default: boolean;
  is_active: boolean;
  is_in_stock: boolean;
}; 


export type ProductImage = {
  id: number;
  image_url: string | null;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
};

export type ProductAttribute = {
  id: number;

  group: string;
  group_slug: string;
  group_order: number;

  name: string;
  slug: string;

  data_type: string;
  value: string;
  unit: string;

  attribute_order: number;
};

export type ProductDetail = Product & {
  price: string | null;
  currency: string;
  stock_status: string;

  description: string;

  images: ProductImage[];
  variants: ProductVariant[];
  attributes: ProductAttribute[];

  created_at: string;
  updated_at: string;
};
type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type ProductReview = {
  id: number;
  product: number;
  user: number;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
};



export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Kategoriler alınamadı. HTTP durum kodu: ${response.status}`
    );
  }

  return response.json();
}



export async function getBrands(): Promise<Brand[]> {
  const response = await fetch(`${API_URL}/brands/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Markalar alınamadı. HTTP durum kodu: ${response.status}`
    );
  }

  const data: PaginatedResponse<Brand> =
    await response.json();

  return data.results;
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(
    `${API_URL}/products/`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Ürünler alınamadı.
HTTP ${response.status}`
    );
  }

  const data: PaginatedResponse<Product> =
    await response.json();

  return data.results;
}


export async function getProductBySlug(
  slug: string
): Promise<ProductDetail> {
  const response = await fetch(
    `${API_URL}/products/${slug}/`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Ürün detayı alınamadı. HTTP ${response.status}`
    );
  }

  return response.json();
}


export type AttributeOption = {
  id: number;
  value: string;
};


export async function getProductReviews(
  slug: string
): Promise<ProductReview[]> {
  const response = await fetch(
    `${API_URL}/products/${slug}/reviews/`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Yorumlar alınamadı. HTTP ${response.status}`
    );
  }

  const data: PaginatedResponse<ProductReview> =
    await response.json();

  return data.results;
}
export type CategoryAttribute = {
  id: number;
  slug: string;
  name: string;
  data_type:
    | "text"
    | "integer"
    | "decimal"
    | "boolean"
    | "single_select"
    | "multi_select";
  unit: string;
  is_required: boolean;
  is_filterable: boolean;
  display_order: number;
  options: AttributeOption[];
};

export type AttributeGroupWithAttributes = {
  name: string;
  slug: string;
  display_order: number;
  attributes: CategoryAttribute[];
};

export type CategoryAttributesResponse = {
  category: Category;
  attribute_groups: AttributeGroupWithAttributes[];
};

export async function getCategoryAttributes(
  slug: string
): Promise<CategoryAttributesResponse> {
  const response = await fetch(
    `${API_URL}/categories/${slug}/attributes/`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Kategori özellikleri alınamadı. HTTP ${response.status}`
    );
  }

  return response.json();
}