import Link from "next/link";

import type { CategoryNode } from "@/services/catalog";

type CategoryColumnListProps = {
  nodes: CategoryNode[];
  depth?: number;
};

const CategoryColumnList = ({ nodes, depth = 0 }: CategoryColumnListProps) => {
  if (nodes.length === 0) {
    return null;
  }

  return (
    <div
      className="flex flex-col gap-2"
      style={depth > 0 ? { marginLeft: depth * 12 } : undefined}
    >
      {nodes.map((node) => (
        <div key={node.slug}>
          <Link
            href={`/kategori/${node.slug}`}
            className="text-[13px] font-semibold text-[oklch(45%_0.02_60)] transition hover:text-[oklch(20%_0.01_60)]"
          >
            {node.name}
          </Link>

          {node.children.length > 0 ? (
            <CategoryColumnList nodes={node.children} depth={depth + 1} />
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default CategoryColumnList;
