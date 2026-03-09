// src/pages/Shop.jsx (Updated to use imported image)

import React, { useMemo, useState } from 'react';
import { SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import FeatureStrip from '../components/FeatureStrip';
import ProductCard from '../components/ProductCard';
import { images } from '../data/productImages';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useGetNavCategoriesQuery } from '../slices/categoriesApiSlice';
import { parsePriceValue } from '../utils/price';

// Constants for pagination
const PRODUCTS_PER_PAGE = 16;

const ShopPage = ({ goToProduct }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('default');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: ALL_PRODUCTS, isLoading, error } = useGetProductsQuery();
  const { data: navCategories = [] } = useGetNavCategoriesQuery();

  const categoryOptions = useMemo(() => {
    const seen = new Set();
    const options = [{ value: 'all', label: 'All', keywords: ['all'] }];

    navCategories.forEach((cat) => {
      const catValue = cat.slug || cat._id || cat.name;
      if (catValue && !seen.has(catValue)) {
        seen.add(catValue);
        options.push({
          value: catValue,
          label: cat.name,
          keywords: [cat.name, cat.slug].filter(Boolean),
        });
      }

      (cat.subcategories || []).forEach((sub) => {
        const subValue = sub.slug || sub._id || sub.name;
        if (subValue && !seen.has(subValue)) {
          seen.add(subValue);
          options.push({
            value: subValue,
            label: sub.name,
            keywords: [sub.name, sub.slug, cat.name, cat.slug].filter(Boolean),
          });
        }
      });
    });

    return options;
  }, [navCategories]);

  const filterProducts = (products) => {
    if (selectedCategory === 'all') {
      return products;
    }

    const currentCategory = categoryOptions.find((c) => c.value === selectedCategory);
    const keywords = (currentCategory?.keywords || []).map((k) => k.toLowerCase());

    return products.filter((product) => {
      const text = [
        typeof product.category === 'string' ? product.category : product.category?.name,
        product.category?.slug,
        product.description,
        product.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return keywords.some((keyword) => text.includes(keyword));
    });
  };

  const sortProducts = (products) => {
    const sortedProducts = [...products];
    if (sortOrder === 'price-asc') {
      sortedProducts.sort((a, b) => {
        const priceA = parsePriceValue(a.price);
        const priceB = parsePriceValue(b.price);
        return priceA - priceB;
      });
    } else if (sortOrder === 'price-desc') {
      sortedProducts.sort((a, b) => {
        const priceA = parsePriceValue(a.price);
        const priceB = parsePriceValue(b.price);
        return priceB - priceA;
      });
    }
    return sortedProducts;
  };
  if (isLoading) return <div className="py-24 text-center text-3xl font-bold">Loading...</div>;
  if (error) return <div className="py-24 text-center text-red-500 font-bold">Error: {error?.data?.message || error.error}</div>;

  const filteredProducts = filterProducts(ALL_PRODUCTS || []);
  const sortedAndFilteredProducts = sortProducts(filteredProducts);
  const currentTotalResults = sortedAndFilteredProducts.length;
  const currentTotalPages = Math.ceil(currentTotalResults / PRODUCTS_PER_PAGE);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const shopProducts = sortedAndFilteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= currentTotalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };


  return (
    <>
      {/* 1. Shop Banner */}
      <div
        className="py-24 text-center bg-cover bg-center relative border-b border-stone-200"
        style={{
          backgroundImage: `url(${images.shopBanner})` // <-- Use imported image
        }}
      >
        <div className="absolute inset-0 bg-white opacity-60"></div>
        <div className="relative z-10">
          <h1 className="font-display text-4xl md:text-5xl tracking-[0.12em] uppercase font-medium text-gray-900 mb-2">Shop</h1>
          <p className="text-gray-900 text-xs tracking-[0.1em] uppercase">
            Home <span className="font-semibold text-primary"> &gt; Shop</span>
          </p>
        </div>
      </div>

      {/* 2. Filter / Sort Bar */}
      <div className="bg-background-light py-5 border-b border-stone-200">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3 lg:gap-4">
            <div className="h-12 px-4 bg-white border border-stone-300 flex items-center gap-3">
              <SlidersHorizontal className="w-5 h-5 text-stone-700" />
              <span className="text-sm tracking-[0.1em] uppercase font-semibold text-stone-800">Filter By</span>
            </div>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="h-12 min-w-[180px] bg-white border border-stone-300 px-4 text-sm tracking-[0.08em] uppercase text-stone-900"
            >
              {categoryOptions.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            <div className="h-12 px-4 bg-white border border-stone-300 hidden sm:flex items-center gap-3">
              <Grid3X3 className="w-5 h-5 text-stone-900" />
              <List className="w-5 h-5 text-stone-400" />
            </div>

            <span className="text-stone-500 text-sm">
              Showing {Math.min(startIndex + 1, currentTotalResults)}-{Math.min(endIndex, currentTotalResults)} of {currentTotalResults} results
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:gap-4">
            <div className="h-12 px-4 bg-white border border-stone-300 flex items-center gap-3">
              <span className="text-sm tracking-[0.08em] uppercase text-stone-800">Show</span>
              <select className="h-10 bg-transparent px-1 text-sm tracking-[0.08em] uppercase text-stone-900">
                <option value="16">16</option>
              </select>
            </div>

            <div className="h-12 px-4 bg-white border border-stone-300 flex items-center gap-3">
              <span className="text-sm tracking-[0.08em] uppercase text-stone-800">Sort by</span>
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  handlePageChange(1);
                }}
                className="h-10 bg-transparent px-1 text-sm tracking-[0.08em] uppercase text-stone-900"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price A-Z</option>
                <option value="price-desc">Price Z-A</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Product Grid */}
      <div className="py-16 bg-[#efefef]">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {shopProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>

          {/* 4. Pagination (Functional) */}
          <div className="flex justify-center space-x-4 mt-10">
            {[...Array(currentTotalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`${currentPage === pageNumber
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-900 hover:bg-black hover:text-white border-gray-300'
                    } border text-sm tracking-[0.08em] uppercase font-semibold py-3 px-5 transition duration-200`}
              >
                {pageNumber}
              </button>
              );
            })}

            {currentPage < currentTotalPages && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="bg-white border border-gray-300 text-gray-900 text-sm tracking-[0.08em] uppercase font-semibold py-3 px-5 hover:bg-black hover:text-white transition duration-200"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 5. Feature Strip */}
      <FeatureStrip />
    </>
  );
};

export default ShopPage;
