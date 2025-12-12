interface ProductDetailsTableProps {
  brandName: string;
  statusName: string;
  categoryName: string;
  stock: number;
}

export function ProductDetailsTable({
  brandName,
  statusName,
  categoryName,
  stock,
}: ProductDetailsTableProps) {
  return (
    <div className="border-t border-gray-200 pt-6 space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">Especificaciones</h2>
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-gray-500">Marca</dt>
          <dd className="font-medium text-gray-900">{brandName}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Estado</dt>
          <dd className="font-medium text-gray-900">{statusName}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Categoría</dt>
          <dd className="font-medium text-gray-900">{categoryName}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Stock</dt>
          <dd className="font-medium text-gray-900">{stock} unidades</dd>
        </div>
      </dl>
    </div>
  );
}
