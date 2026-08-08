type ProductDescriptionProps = {
  description: string;
};

export default function ProductDescription({
  description,
}: ProductDescriptionProps) {
  if (!description?.trim()) {
    return null;
  }

  return (
    <section className="mt-10">
      <details className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <summary className="cursor-pointer px-6 py-5 text-lg font-semibold text-gray-900">
          Ürün Açıklaması
        </summary>

        <div className="border-t border-gray-200 px-6 py-5">
          <p className="whitespace-pre-line leading-8 text-gray-600">
            {description}
          </p>
        </div>
      </details>
    </section>
  );
}