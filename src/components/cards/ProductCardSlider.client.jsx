// ProductCardSlider.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import { ProductCard } from './ProductCard';

export function ProductCardSlider({ products, label, className, loading, onClick }) {
  const styles = clsx('grid gap-6', className);

  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={4}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 },
      }}
    >
      {products.map((product, index) => (
        <SwiperSlide key={index}>
          <ProductCard
            product={product}
            label={label}
            className={styles}
            loading={loading}
            onClick={onClick}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
