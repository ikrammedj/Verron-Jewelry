'use client';
import { useEffect, useState } from "react";
import StickyNavbar from "../Components/StickyNavbar";
import Sidebar from "../Components/Sidebar";
import Footer2 from "../Components/Footer2";
import SearchBarWithFilter from "../Components/SearchBar";
import AnimatedSection from "../Components/AnimatedSection"; // Assure-toi du chemin

export default function BijouxCatalogueHTML() {
  const [bijoux, setBijoux] = useState([]);
  const [url, setUrl] = useState("http://127.0.0.1:5000/bijoux");
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    async function applyXSLT() {
      try {
        const xmlResponse = await fetch(url);
        const xmlText = await xmlResponse.text();
        const xmlDoc = new DOMParser().parseFromString(xmlText, "application/xml");

        const xslResponse = await fetch("/bijoux.xslt");
        const xslText = await xslResponse.text();
        const xslDoc = new DOMParser().parseFromString(xslText, "application/xml");

        const xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xslDoc);

        const resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);

        if (resultDocument) {
          const container = document.getElementById("resultat-xslt");
          container.innerHTML = "";
          container.appendChild(resultDocument);
        } else {
          console.error("Transformation XSLT retournée vide ou invalide");
        }
      } catch (error) {
        console.error("Erreur XSLT :", error);
      }
    }

    applyXSLT();
  }, [url]);

  useEffect(() => {
    async function fetchBijouxHTML() {
      try {
        const response = await fetch("./bijoux.html");
        const htmlText = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");

        const sections = doc.querySelectorAll(".section");
        const allBijoux = [];

        sections.forEach(section => {
          const titreSection = section.querySelector("h2")?.textContent || "";
          const produits = section.querySelectorAll(".produit");

          produits.forEach(produit => {
            const nom = produit.querySelector(".titre-produit")?.textContent;
            const prix = produit.querySelector("div strong + div")?.textContent?.replace("Prix :", "").trim();
            const description = produit.querySelector("p")?.textContent;
            const image = produit.querySelector("img")?.src;
            const imageSrc = image?.startsWith("/images/")
        ? image
        : `/images/${image?.replace(/^.*[\\/]/, "")}`;

            allBijoux.push({ nom, prix, description, image: imageSrc, categorie: titreSection });
          });
        });

        setBijoux(allBijoux);
      } catch (error) {
        console.error("Erreur de chargement du fichier HTML :", error);
      }
    }

    fetchBijouxHTML();
  }, []);

  return (
    <div>
      <StickyNavbar />
      <Sidebar onSearchClick={() => setShowSearchBar(!showSearchBar)} /> 

      {/* Animation sur le titre */}
      <AnimatedSection delay={0.1}>
        <div className="bg-[#F7F1EB] px-20 pt-20">
          <h1 className="text-left text-[#9E6F6F] mb-10 text-4xl font-bolder font-['Libre_Bodoni']">
            Catalogue de Bijoux
          </h1>
        </div>
      </AnimatedSection>
      <AnimatedSection delay={0.2}>
        <div className="bg-[#F7F1EB] px-20">
          <SearchBarWithFilter 
            setBijoux={setUrl}
            showSearchBar={showSearchBar} 
          />
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.3}>
        <div id="resultat-xslt" className="bg-[#F7F1EB] px-20 pb-20">
          {bijoux.length === 0 ? (
            <div className="flex justify-center items-center min-h-screen">
              <svg
                className="animate-spin h-8 w-8 text-[#4b4040]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                ></path>
              </svg>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bijoux.map((bijou, index) => (
                <AnimatedSection key={index} delay={0.4 + index * 0.1}>
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <img src={bijou.image} alt={bijou.nom} className="w-full h-64 object-cover mb-4 rounded" />
                    <h2 className="text-xl font-semibold mb-2">{bijou.nom}</h2>
                    <p className="text-gray-700 mb-2">{bijou.description}</p>
                    <p className="text-[#9E6F6F] font-bold">{bijou.prix} DA</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>

      <Footer2 />
    </div>
  );
}
