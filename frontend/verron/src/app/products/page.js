'use client';
import { useEffect, useState } from "react";
import StickyNavbar from "../Components/StickyNavbar";
import Sidebar from "../Components/Sidebar";
import Footer2 from "../Components/Footer2";
import SearchBarWithFilter from "../Components/SearchBar";

export default function BijouxCatalogueHTML() {
  const [bijoux, setBijoux] = useState([]);
  const [url, setUrl] = useState("http://localhost:5000/bijoux");
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    async function applyXSLT() {
      try {
        const xmlResponse = await fetch(url);
        console.log(xmlResponse);
        const xmlText = await xmlResponse.text();
        const xmlDoc = new DOMParser().parseFromString(xmlText, "application/xml");

        console.log("XML Document:", xmlDoc);

        // Charger le XSL
        const xslResponse = await fetch("/bijoux.xslt");
        const xslText = await xslResponse.text();

        const xslDoc = new DOMParser().parseFromString(xslText, "application/xml");
        console.log("XSL Document:", xslDoc);

        // Appliquer la transformation XSLT
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
            const imageSrc = image?.startsWith("/static")
              ? image
              : `/static/${image.replace(/^static\//, "")}`;

            allBijoux.push({ nom, prix, description, image, categorie: titreSection });
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
      <Sidebar onSearchClick={() => setShowSearchBar(true)} />
      
      {/* Ajouter un conteneur pour le titre et la searchbar */}
      <div className="bg-[#F7F1EB] px-20 pt-20">
        {/* Titre "Catalogue de Bijoux" */}
        <h1 className="text-left text-[#9E6F6F] mb-10 text-4xl font-bolder font-['Libre_Bodoni']">
          Catalogue de Bijoux
        </h1>
        
        {/* Barre de recherche et filtres */}
        {showSearchBar && (
          <div className="mb-10">
            <SearchBarWithFilter 
              setBijoux={setUrl}
              onClose={() => setShowSearchBar(false)} 
            />
          </div>
        )}
      </div>
      
      {/* Conteneur pour les résultats XSLT */}
      <div id="resultat-xslt" className="bg-[#F7F1EB] px-20 pb-20">
        {bijoux.length === 0 && (
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
        )}
      </div>

      <Footer2 />
    </div>
  );
}