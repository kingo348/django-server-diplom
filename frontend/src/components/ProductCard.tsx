import React from 'react';

type ProductProps = {
  name: string;
  price: number;
  image: string;
};

const ProductCard: React.FC<ProductProps> = ({ name, price, image }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all transform hover:scale-105">
      <img
        src={image || 'default-image.jpg'}
        alt={name}
        className="w-full h-60 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-gray-600 mt-2">{price.toLocaleString()} ₽</p>
      </div>
    </div>
  );
};

export default ProductCard;
