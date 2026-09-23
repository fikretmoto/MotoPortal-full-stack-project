import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type ProductAttributeValues = Record<string, string | string[]>;

export type ProductEditData = {
  id: number;
  name: string;
  slug: string;
  brand: number;
  category: number;
  product_code: string;
  price: string;
  discount_price: string | null;
  currency: string;
  stock_status: string;
  short_description: string;
  description: string;
  is_featured: boolean;
  is_active: boolean;
  instagram_url: string | null;
  whatsapp_number: string | null;
  cover_image_url: string | null;
  attributes: ProductAttributeValues;
};

export async function getProductForEdit(
  slug: string
): Promise<ProductEditData | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return null;
  }

  const response = await fetch(`${API_URL}/products/${slug}/edit/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export type DashboardProductListItem = {
  id: number;
  name: string;
  display_name: string;
  slug: string;
  brand_name: string;
  category_name: string;
  cover_image_url: string | null;
  price: string;
  discount_price: string | null;
  currency: string;
  stock_status: string;
  is_active: boolean;
  created_at: string;
};

export async function getDashboardProducts(): Promise<
  DashboardProductListItem[]
> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return [];
  }

  const response = await fetch(`${API_URL}/products/dashboard/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}