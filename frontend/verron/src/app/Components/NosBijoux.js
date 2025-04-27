'use client'

import dynamic from 'next/dynamic';
import { useState } from 'react';

const MiniCarousel = dynamic(() => import('./MiniCarousel'), { ssr: false });

const NosBijoux = () => {
 
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = (e) => {
    
    e.preventDefault();

    setIsScrolling(true); 

   
    setTimeout(() => {
      setIsScrolling(false); 
    }, 500); 
  };

  return (
    <div
      className={`nos-bijoux-container bg-[#F7F1EB] flex flex-col md:flex-row items-center justify-center gap-28 p-6 md:p-12 ${isScrolling ? 'scrolling' : ''}`}
      onWheel={handleScroll} 
    >
      <div className="w-full md:w-1/2">
        <MiniCarousel />
      </div>

      <div className="max-w-lg text-center md:text-left nos-bijoux-text">
        <h1 className="text-10xl lg:text-5xl font-libre font-extrabold text-[#9E6F6F] mb-4">
          Nos bijoux 
        </h1>
        <p className="text-lg text-[#5D4E4E] leading-relaxed">
          Une sélection raffinée pour sublimer chaque instant.
          Notre collection met en lumière des bijoux soigneusement choisis pour leur élégance et la qualité des matériaux.
          Finitions délicates et designs intemporels : chaque pièce incarne un équilibre entre authenticité et sophistication.  
        </p>
      </div>
    </div>
  );
};

export default NosBijoux;
