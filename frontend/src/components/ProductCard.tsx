import React from "react";

type ProductProps = {
  name: string;
  price: number;
  image?: string | null;
};

const ProductCard: React.FC<ProductProps> = ({ name, price, image }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      {image ? (
        <img src={`http://localhost:8000${image}`} alt={name} className="w-full h-60 object-cover" />
      ) : (
        <div className="w-full h-60 bg-gray-200 flex items-center justify-center text-gray-500">
          Нет изображения
        </div>
      )}
      <div className="p-4">
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-gray-600 mt-2">{price.toLocaleString()}₽</p>
      </div>
    </div>
  );
};

export default ProductCard;
