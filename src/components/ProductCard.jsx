import React from 'react';
import { Link } from 'react-router-dom';
import { formatUsd } from '../utils/price';
import WishlistHeart from './WishlistHeart';

const ProductCard = ({ product }) => {
  const productId = product?._id || product?.id;
  const productPath = `/shop/${product?.slug || productId}`;
  const imageSrc = Array.isArray(product?.images) && product.images.length > 0
    ? product.images[0]
    : product?.image;
  const brandLabel = typeof product?.brand === 'string'
    ? product.brand
    : product?.brand?.name || (typeof product?.category === 'string' ? product.category : product?.category?.name || '');

  const swatchesFromColors = Array.isArray(product?.colors)
    ? product.colors.map((color, index) => {
      if (typeof color === 'string' && color.trim().startsWith('#')) {
        return { key: `color-${index}`, hex: color.trim() };
      }
      if (typeof color === 'object' && color?.hex) {
        return { key: `color-${index}`, hex: color.hex };
      }
      if (typeof color === 'object' && color?.colorHex) {
        return { key: `color-${index}`, hex: color.colorHex };
      }
      return null;
    }).filter(Boolean)
    : [];

  const swatchesFromVariants = Array.isArray(product?.variants)
    ? product.variants
      .filter((variant) => variant?.colorHex)
      .map((variant, index) => ({ key: `variant-${index}`, hex: variant.colorHex }))
    : [];

  const swatches = [...swatchesFromColors, ...swatchesFromVariants]
    .filter((swatch, index, arr) => arr.findIndex((item) => item.hex?.toLowerCase() === swatch.hex?.toLowerCase()) === index)
    .slice(0, 3);

  return (
    <article className="group">
      <div className="relative overflow-hidden bg-[#ececf0] aspect-[4/6]">
        <Link to={productPath} className="block h-full w-full">
        <img
          src={imageSrc}
          alt={product?.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
        />
        </Link>

        {productId && (
          <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="pointer-events-auto flex h-12 items-center gap-3 bg-black/95 px-4 text-white">
              <WishlistHeart
                productId={productId}
                variant="card"
                className="bg-transparent !p-0 text-white hover:text-white"
              />
              <Link
                to={productPath}
                className="flex-1 text-center text-[12px] tracking-[0.18em] uppercase"
                aria-label={`Quick view ${product?.name}`}
              >
                Quick view
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 text-center">
        {brandLabel && (
          <p className="text-[13px] leading-none font-light text-[#2f2f2f] lowercase">
            {brandLabel}
          </p>
        )}

        <h3 className="mt-2 min-h-[3.2rem] text-[18px] leading-[1.2] tracking-[0.24em] uppercase text-[#1f1f1f]">
          <Link to={productPath}>{product?.name}</Link>
        </h3>

        <p className="mt-2 text-[14px] leading-none text-[#3a3a3a]">
          {formatUsd(product?.price)}
        </p>

        {swatches.length > 0 && (
          <div className="mt-4 flex justify-center gap-2">
            {swatches.map((swatch) => (
              <span
                key={swatch.key}
                className="h-10 w-10 border border-black/10"
                style={{ backgroundColor: swatch.hex }}
                aria-hidden="true"
              />
            ))}
          </div>
        )}

        {product?.discount > 0 && (
          <p className="mt-2 text-[13px] text-gray-400 line-through">
            {formatUsd(product?.originalPrice)}
          </p>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
