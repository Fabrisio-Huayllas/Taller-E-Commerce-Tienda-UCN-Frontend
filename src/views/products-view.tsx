import { ProductCard } from "@/components";
import { Product } from "@/models/product";

const products: Product[] = [
  {
    id: 1,
    name: "Camiseta UCN",
    description: "Camiseta oficial de la Universidad Católica del Norte",
    price: 15990,
    imageUrl: "/products/camiseta-ucn.jpg",
  },
];

export default function ProductsView() {
  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="flex justify-center items-center text-5xl p-2 italic">
        Productos Disponibles
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
