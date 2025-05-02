import React from 'react'
import {
  MapPin,
  Instagram,
  Phone,
  Mail
} from 'lucide-react'

const Footer = () => {
  return (
    <div id="contact" className="flex flex-col md:flex-row items-start justify-between bg-[#F7F1EB] p-8 shadow-lg">

      <div className="w-full md:w-1/2 h-72 md:h-96 mb-6 md:mb-0 rounded-xl overflow-hidden shadow-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25569.22542729427!2d3.041531305326007!3d36.76689260336008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb2f877796ffd%3A0x62ac3794efff79ca!2sAlger%20Centre!5e0!3m2!1sfr!2sdz!4v1738964097396!5m2!1sfr!2sdz"
          width="100%"
          height="100%"
          style={{ border: "0" }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

      <div className="w-full md:w-1/2 flex flex-col space-y-6 md:pl-10">
        <h1 className="text-3xl font-libre font-extrabold text-[#9E6F6F] mb-4 text-center md:text-left">
          Contactez Nous
        </h1>

        <div className="flex items-center space-x-3">
          <MapPin className="text-[#9E6F6F]" />
          <div>
            <h2 className="text-lg font-extrabold text-[#9E6F6F]">Localisation</h2>
            <p className="text-[#5D4E4E]">Alger Centre</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Instagram className="text-[#9E6F6F]" />
          <div>
            <h2 className="text-lg font-extrabold text-[#9E6F6F]">Instagram</h2>
            <a href="https://www.instagram.com/verron_jewelry/" className="text-[#5D4E4E] hover:underline">@verron_jewelry</a>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Phone className="text-[#9E6F6F]" />
          <div>
            <h2 className="text-lg font-extrabold text-[#9E6F6F]">Téléphone</h2>
            <p className="text-[#5D4E4E]">+213 659 12 58 01</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Mail className="text-[#9E6F6F]" />
          <div>
            <h2 className="text-lg font-extrabold text-[#9E6F6F]">E-mail</h2>
            <p className="text-[#5D4E4E] underline">verronjewelry@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
