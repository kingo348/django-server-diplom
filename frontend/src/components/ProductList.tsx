import React from "react";
import ProductCard from "./ProductCard";

type Props = {
  products: {
    id: number;
    name: string;
    price: number;
    image: string | null;
  }[];
};

const ProductList: React.FC<Props> = ({ products }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
          price={product.price}
          image={product.image}
        />
      ))}
    </div>
  );
};

export default ProductList;
