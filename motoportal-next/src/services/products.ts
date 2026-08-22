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