import { cache } from "react";

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
  is_vehicle: boolean;
};


export type CategoryNode = {
  id: number;
  name: string;
  slug: string;
  children: CategoryNode[];
};

export async function getCategoryTree(): Promise<CategoryNode[]> {
  const response = await fetch(`${API_URL}/categories/tree/`, {
    next: { revalidate: 3600 }, // kategori ağacı sık değişmiyor, 1 saat cache
  });

  if (!response.ok) {
    throw new Error(
      `Kategori ağacı alınamadı. HTTP durum kodu: ${response.status}`
    );
  }

  return response.json();
}

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


export type ProductBadge = {
  type: string;
  label: string;
};



export type HomepageBand = {
  id: number;
  title: string;
  display_order: number;
  products: Product[];
};

export async function getHomepageBands(): Promise<HomepageBand[]> {
  const response = await fetch(
    `${API_URL}/homepage-bands/`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Anasayfa bantları alınamadı. HTTP ${response.status}`
    );
  }

  return response.json();
}

export type Product = {
  id: number;
  name: string;
  display_name: string;
  slug: string;
  brand: Brand;
  category: Category;
  short_description: string;
  cover_image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  price: string | null;
  discount_price: string | null;
  currency: string;
  stock_status: string;
  badges: ProductBadge[];
  average_rating: number | null;
  review_count: number;
  is_favorited: boolean;
};



export type ProductVariant = {
  id: number;
  sku: string;
  color: string;
  size: string;
  trim: string;
  capacity: string;
  wheel_size: string;
  material: string;
  bundle: string;
  price: string | null;
  effective_price: string | null;
  stock_quantity: number;
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



export type ProductResource = {
  id: number;
  title: string;
  file_url: string | null;
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

  is_highlight: boolean;
  highlight_image_url: string | null;
  highlight_title: string;
  highlight_description: string;
};

export type ProductDetail = Product & {
  price: string | null;
  discount_price: string | null;
  currency: string;
  stock_status: string;

  description: string;
  instagram_url: string | null;
  whatsapp_number: string | null;

  images: ProductImage[];
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  resources: ProductResource[];

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



// React cache() ile sarmalı: generateMetadata (getCategoryBySlug
// üzerinden) ve sayfa gövdesi aynı render pass'te bu fonksiyonu
// çağırırsa, gerçek fetch tek seferde yapılır.
export const getCategories = cache(async (): Promise<Category[]> => {
  const response = await fetch(`${API_URL}/categories/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Kategoriler alınamadı. HTTP durum kodu: ${response.status}`
    );
  }

  return response.json();
});

// generateMetadata'daki getCategories()+.find() tekrarını tek bir
// yerde toplar; getCategories() zaten cache()'li olduğu için sayfa
// gövdesindeki ayrı getCategories()+.find() çağrısıyla aynı fetch'i
// paylaşır.
export const getCategoryBySlug = cache(
  async (slug: string): Promise<Category | null> => {
    const categories = await getCategories();
    return categories.find((c) => c.slug === slug) ?? null;
  }
);



export type VehicleModel = {
  id: number;
  name: string;
  slug: string;
  brand: number;
};

/**
 * "vehicle-models/" backend endpoint'i CanManageProducts ile korumalı
 * olduğu için (dealer'a özel, herkese açık değil), diğer fonksiyonların
 * aksine Django'ya doğrudan değil, Next.js'in kendi proxy route'una
 * (/api/vehicle-models) istek atar — httpOnly JWT cookie'si orada
 * sunucu tarafında okunup Bearer header'a çevriliyor.
 */
export async function getVehicleModels(
  brandSlug: string
): Promise<VehicleModel[]> {
  const response = await fetch(
    `/api/vehicle-models?brand=${encodeURIComponent(brandSlug)}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return [];
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

  const data: Brand[] = await response.json();

  return data;
}

export async function getBrandsWithProducts(): Promise<Brand[]> {
  const response = await fetch(`${API_URL}/brands/?has_products=true`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Markalar alınamadı. HTTP durum kodu: ${response.status}`
    );
  }

  const data: Brand[] = await response.json();

  return data;
}



export async function getBrandsByCategory(
  categorySlug: string
): Promise<Brand[]> {
  const response = await fetch(
    `${API_URL}/categories/${categorySlug}/brands/`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return [];
  }

  const data: Brand[] = await response.json();

  return data;
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




export type ProductPage = {
  results: Product[];
  count: number;
};

export type ProductQueryParams = {
  category?: string;
  brand?: string;
  tag?: string;
  on_discount?: boolean;
  facets?: string;
  price_min?: string;
  price_max?: string;
  q?: string;
  page?: number;
};

// Tum kategori/etiket/marka urun listeleme fonksiyonlarinin ortak
// cikis noktasi -- backend'deki ProductFilter'in kabul ettigi query
// parametreleriyle birebir orantili. page=1 icin ?page hic yazilmaz
// (DRF zaten varsayilan olarak sayfa 1'i doner, URL'de gereksiz
// parametre birikmesin diye).
async function fetchProductPage(
  params: ProductQueryParams
): Promise<ProductPage> {
  const query = new URLSearchParams();

  if (params.category) query.set("category", params.category);
  if (params.brand) query.set("brand", params.brand);
  if (params.tag) query.set("tag", params.tag);
  if (params.on_discount) query.set("on_discount", "true");
  if (params.facets) query.set("facets", params.facets);
  if (params.price_min) query.set("price_min", params.price_min);
  if (params.price_max) query.set("price_max", params.price_max);
  if (params.q) query.set("q", params.q);
  if (params.page && params.page > 1) {
    query.set("page", String(params.page));
  }

  const queryString = query.toString();
  const response = await fetch(
    `${API_URL}/products/${queryString ? `?${queryString}` : ""}`,
    {
      cache: "no-store",
    }
  );

  // Gecersiz/asiri page (DRF PageNumberPagination bunu 404 yapar) ya
  // da baska bir hata -- cokmek yerine bos sonuc donuyoruz, cagiran
  // taraf (sayfa bileseni) bunu "urun yok" olarak gosterir.
  if (!response.ok) {
    return { results: [], count: 0 };
  }

  const data: PaginatedResponse<Product> = await response.json();

  return { results: data.results, count: data.count };
}

// VehicleSearchBox'taki marka->model dropdown'u icin: bir markanin
// TUM urunlerini (sayfalama sinirina takilmadan) dondurur. `next`
// linkini sonuna kadar takip eder (sitemap.ts'teki
// getAllActiveProducts ile ayni desen).
export async function getProductsByBrand(
  brandSlug: string
): Promise<Product[]> {
  const products: Product[] = [];
  let page = 1;

  while (true) {
    const { results, count } = await fetchProductPage({
      brand: brandSlug,
      page,
    });

    products.push(...results);

    if (products.length >= count || results.length === 0) {
      break;
    }

    page += 1;
  }

  return products;
}

export async function getProductsByBrandPage(
  brandSlug: string,
  params: {
    category?: string;
    price_min?: string;
    price_max?: string;
    facets?: string;
    page?: number;
  }
): Promise<ProductPage> {
  return fetchProductPage({ brand: brandSlug, ...params });
}

export async function getProductsByTag(
  tagSlug: string,
  page = 1
): Promise<ProductPage> {
  return fetchProductPage({ tag: tagSlug, page });
}

export async function getProductsByTagAndCategories(
  tagSlug: string,
  categorySlugs: string[],
  page = 1
): Promise<ProductPage> {
  return fetchProductPage({
    tag: tagSlug,
    category: categorySlugs.join(","),
    page,
  });
}

export async function getProductsByCategory(
  categorySlug: string,
  params: {
    brand?: string;
    price_min?: string;
    price_max?: string;
    facets?: string;
    page?: number;
  } = {}
): Promise<ProductPage> {
  return fetchProductPage({ category: categorySlug, ...params });
}

export async function getProductsOnDiscount(
  page = 1
): Promise<ProductPage> {
  return fetchProductPage({ on_discount: true, page });
}

export async function getProductsBySearch(
  q: string,
  page = 1
): Promise<ProductPage> {
  if (!q.trim()) {
    return { results: [], count: 0 };
  }

  return fetchProductPage({ q, page });
}
// React cache() ile sarmalı: generateMetadata() ve sayfa gövdesi aynı
// slug için bu fonksiyonu çağırdığında (aynı render pass içinde),
// gerçek fetch sadece bir kez yapılır -- `cache: "no-store"` fetch
// seçeneğiyle Next'in otomatik request memoization'ının davranışı
// garanti olmadığı için (farklı Next sürümlerinde değişebiliyor),
// burada React'ın kendi cache()'ine güveniyoruz.
export const getProductBySlug = cache(
  async (slug: string): Promise<ProductDetail> => {
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
);


// React cache() ile sarmalı: marka sayfasının generateMetadata'sı bu
// fonksiyonu kullanıyor, aynı render pass içinde tekrar çağrılırsa
// (örn. ileride sayfa gövdesi de buna geçerse) fetch tekrarlanmaz.
export const getBrandBySlug = cache(async (slug: string): Promise<Brand> => {
  const response = await fetch(
    `${API_URL}/brands/${slug}/`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Marka detayı alınamadı. HTTP ${response.status}`
    );
  }

  return response.json();
});


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

export type SiteContent = {
  kargo_teslimat: string;
  iade_degisim: string;
  garanti_bilgisi: string;
};

export async function getSiteContent(): Promise<SiteContent> {
  const response = await fetch(`${API_URL}/site-content/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return { kargo_teslimat: "", iade_degisim: "", garanti_bilgisi: "" };
  }

  return response.json();
}

export type InstallmentOption = {
  id: number;
  brand_slug: string | null;
  category_slug: string | null;
  bank_name: string;
  installment_count: number;
  rate: string;
  display_order: number;
};

export async function getInstallmentOptions(): Promise<InstallmentOption[]> {
  const response = await fetch(`${API_URL}/installment-options/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data.results ?? [];
}