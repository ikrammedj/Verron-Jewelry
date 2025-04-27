'use client'
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper';


export default function MiniCarousel() {
  return (
    <div className="w-full h-[100px] md:h-[400px] rounded-lg shadow-lg overflow-hidden">
      <Swiper
        modules={[Navigation]}
        navigation
        loop
        className="h-full"
      >
        <SwiperSlide>
          <img
            src="assets/IMG_6278.jpg"
            alt="Bijou 1"
            className="object-cover w-full h-full"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="assets/IMG_6269.jpg"
            alt="Bijou 2"
            className="object-cover w-full h-full"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="assets/IMG_6533.jpg"
            alt="Bijou 3"
            className="object-cover w-full h-full"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
