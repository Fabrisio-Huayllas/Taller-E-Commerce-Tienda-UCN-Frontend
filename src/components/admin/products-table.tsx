import { AdminProduct } from "@/services/adminProductService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Power, Trash2 } from "lucide-react";
import Image from "next/image";

interface ProductsTableProps {
  products: AdminProduct[];
  onEdit: (productId: number) => void;
  onToggleStatus: (productId: number) => void;
  onDelete: (productId: number) => void;
}

export function ProductsTable({
  products,
  onEdit,
  onToggleStatus,
  onDelete,
}: ProductsTableProps) {
  return (
    <>
      {/* Vista de tabla para desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-3 text-left">Imagen</th>
              <th className="p-3 text-left">Producto</th>
              <th className="p-3 text-left">Categoría</th>
              <th className="p-3 text-left">Marca</th>
              <th className="p-3 text-right">Precio</th>
              <th className="p-3 text-center">Stock</th>
              <th className="p-3 text-center">Estado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="p-3">
                  <Image
                    src={product.mainImageURL || "/placeholder.png"}
                    alt={product.title}
                    width={60}
                    height={60}
                    className="rounded object-cover"
                  />
                </td>
                <td className="p-3">
                  <div>
                    <p className="font-medium">{product.title}</p>
                    <p className="text-sm text-gray-500">
                      {product.statusName}
                    </p>
                  </div>
                </td>
                <td className="p-3">{product.categoryName}</td>
                <td className="p-3">{product.brandName}</td>
                <td className="p-3 text-right">
                  <div>
                    <p className="font-medium">${product.finalPrice}</p>
                    {product.price !== product.finalPrice && (
                      <p className="text-sm text-gray-500 line-through">
                        ${product.price}
                      </p>
                    )}
                  </div>
                </td>
                <td className="p-3 text-center">
                  <Badge
                    variant={
                      product.stockIndicator === "Alto"
                        ? "default"
                        : product.stockIndicator === "Medio"
                          ? "secondary"
                          : product.stockIndicator === "Bajo"
                            ? "destructive"
                            : "outline"
                    }
                  >
                    {product.stock} ({product.stockIndicator})
                  </Badge>
                </td>
                <td className="p-3 text-center">
                  <Badge
                    variant={product.isAvailable ? "default" : "secondary"}
                  >
                    {product.isAvailable ? "Activo" : "Inactivo"}
                  </Badge>
                </td>
                <td className="p-3">
                  <div className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(product.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onToggleStatus(product.id)}
                    >
                      <Power className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista de cards para móvil */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-3"
          >
            <div className="flex gap-4">
              <Image
                src={product.mainImageURL || "/placeholder.png"}
                alt={product.title}
                width={80}
                height={80}
                className="rounded object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium text-lg">{product.title}</h3>
                <p className="text-sm text-gray-500">{product.statusName}</p>
                <div className="flex gap-2 mt-2">
                  <Badge
                    variant={product.isAvailable ? "default" : "secondary"}
                  >
                    {product.isAvailable ? "Activo" : "Inactivo"}
                  </Badge>
                  <Badge
                    variant={
                      product.stockIndicator === "Alto"
                        ? "default"
                        : product.stockIndicator === "Medio"
                          ? "secondary"
                          : product.stockIndicator === "Bajo"
                            ? "destructive"
                            : "outline"
                    }
                  >
                    {product.stock}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Categoría:</span>
                <p className="font-medium">{product.categoryName}</p>
              </div>
              <div>
                <span className="text-gray-500">Marca:</span>
                <p className="font-medium">{product.brandName}</p>
              </div>
              <div>
                <span className="text-gray-500">Precio:</span>
                <div>
                  <p className="font-medium text-lg">${product.finalPrice}</p>
                  {product.price !== product.finalPrice && (
                    <p className="text-xs text-gray-500 line-through">
                      ${product.price}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Stock:</span>
                <p className="font-medium">{product.stockIndicator}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => onEdit(product.id)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onToggleStatus(product.id)}
              >
                <Power className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
