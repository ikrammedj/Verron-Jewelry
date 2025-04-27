'use client';

import Card from './BijouCard';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@material-tailwind/react';

const Produits = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/getProducts?limit=8');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des produits');
      }
      const data = await response.json();
      
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#24001C] via-[#2f073f] to-[#094a57] h-full">

      <div className="my-0 py-6 grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-x-1 gap-y-6">
        {loading ? (
          <p className="text-white text-center col-span-full">Chargement des produits...</p>
        ) : error ? (
          <p className="text-red-500 text-center col-span-full">{error}</p>
        ) : (
          products.map((product, index) => (
            <div key={index} className="m-2">
              <Link href={`/products/${product.id}`}>
                <Card
                  id={product.id}
                  name={product.name}
                  image={product.images}
                  price={product.price}
                />
              </Link>
            </div>
          ))
        )}
      </div>

      <Link href={'/products'}>
        <div className="flex justify-center pb-6">
          <Button size="lg" color="white">
            Tous les produits
          </Button>
        </div>
      </Link>
    </div>
  );
};

export default Produits;