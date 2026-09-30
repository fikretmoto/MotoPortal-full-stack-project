import { getMyFavorites } from "@/services/favorites";
import { FavoriteGrid } from "@/components/account/FavoriteGrid";

export default async function FavorilerimPage() {
  const favorites = await getMyFavorites();

  return (
    <div className="p-4 sm:p-6">
      <h1 className="mb-4 text-lg font-bold text-foreground sm:text-xl">
        Favorilerim
      </h1>

      <FavoriteGrid favorites={favorites} />
    </div>
  );
}
