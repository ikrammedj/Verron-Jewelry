// components/StickyNavbar.js
'use client'

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function StickyNavbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection("#" + entry.target.id);
          }
        }
      },
      {
        rootMargin: "-50% 0px -50% 0px", // zone de détection centrale
        threshold: 0.1,
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  const navItems = [
    { href: "/", label: "Accueil" },
    { href: "/products", label: "Bijoux" }, 
    { href: "/#aprops", label: "À propos" },
    { href: "/#contact", label: "Contacts" },
  ];

  return (
    <nav className="top-0 left-0 right-0 w-full bg-[#F7F1EB] z-50 py-4">
      <div className="flex flex-col items-center">
        <Link href="/#accueil" className="py-1.5 font-medium">
          <img src="/assets/verron_jewelry.png" alt="logo" className="h-18 lg:h-40" />
        </Link>

        <ul className="hidden lg:flex mt-2 flex-row gap-6">
          {navItems.map((item) => {
            const isCurrentPage =
              pathname === item.href ||
              (item.href.includes("#") && activeSection === item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`p-1 font-bold font-libre transition-all duration-200 text-xl ${
                    isCurrentPage
                      ? "text-[#000000] underline underline-offset-4 decoration-2 decoration-[#B4876F]"
                      : "text-[#9E6F6F] hover:text-[#9E6F6F]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
