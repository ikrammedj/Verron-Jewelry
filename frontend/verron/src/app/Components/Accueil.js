'use client';
import React from 'react';
import Link from 'next/link'; 

const Accueil = () => {
  return (
    <div id="accueil" className="bg-[#F7F1EB] flex flex-col md:flex-row items-center justify-center gap-48 p-6 md:p-12">
      <div className="max-w-lg md:text-left">
        <h1 className="text-4xl lg:text-5xl font-libre font-extrabold text-[#9E6F6F] mb-4">
          L’Éclat du Raffinement
          <br />
          La Beauté du Détail
        </h1>
        <p className="text-xl text-[#5D4E4E] leading-relaxed">
          L’alliance parfaite entre modernité et prestige. 
          Nos bijoux, aux lignes épurées subliment chaque 
          geste avec éclat et raffinement. 
        </p>
        <br />
        <Link href="./products">
          <button className="bg-[#9E6F6F] text-white px-6 py-2 rounded-xl text-lg font-semibold hover:bg-[#8a5d5d] transition duration-300">
            Voir Plus
          </button>
        </Link>
      </div>

      <div className="relative w-full md:w-1/4">
        <div className="absolute top-0 left-0 w-[300px] h-[500px] bg-transparent border-2 border-[#9E6F6F] transform rotate-12 rounded-full z-0"></div>
        <img
          src="assets/IMG_6279.jpg"
          alt="Bijou élégant"
          className="relative z-10 w-[300px] h-[500px] rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default Accueil;
