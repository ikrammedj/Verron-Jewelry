import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";

export default function SearchBarWithFilter({ setBijoux, showSearchBar }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [sortOrder, setSortOrder] = useState("asc"); // Nouvel état pour le tri

  const categories = ["Tous", "Bagues", "Boucles d'oreilles"];

  const buildApiUrl = (category, search, sort) => {
    // Gestion des catégories spéciales (boucles d'oreilles)
    const apiCategory = category === "Boucles d'oreilles" 
      ? "boucles_oreilles" 
      : category.toLowerCase();

    let baseUrl;
    if (category === "Tous") {
      baseUrl = "http://127.0.0.1:5000/bijoux";
    } else {
      baseUrl = `http://127.0.0.1:5000/bijoux/categorie/${apiCategory}`;
    }

    // Construction des paramètres
    const params = new URLSearchParams();
    if (search.trim() !== "") params.append("search", search);
    if (sort) params.append("sort", sort);

    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  };

  const fetchBijoux = async () => {
    try {
      const url = buildApiUrl(selectedCategory, searchTerm, sortOrder);
      setBijoux(url);
    } catch (error) {
      console.error("Erreur lors de la récupération des bijoux:", error);
    }
  };

  // Appel automatique quand la catégorie ou le tri change
  useEffect(() => {
    fetchBijoux();
  }, [selectedCategory, sortOrder]);

  // Gestion de la recherche
  const handleSearch = () => {
    fetchBijoux();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col items-center p-6 w-full bg-[#F7F1EB]">
      {/* Barre de recherche (conditionnelle) */}
      {showSearchBar && (
        <div className="w-full max-w-lg relative mb-4">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}  
              placeholder="Rechercher..."
              className="w-full px-5 py-4 text-lg border border-gray-300 rounded-full focus:border-[#9E6F6F] outline-none transition-all duration-200"
            />
            <button 
              onClick={handleSearch} 
              className="flex items-center justify-center h-14 w-14 absolute right-1 bg-[#9E6F6F] text-white rounded-full hover:bg-[#8a5d5d] transition-colors"
              aria-label="Rechercher"
            >
              <CiSearch className="text-2xl" />
            </button>
          </div>
        </div>
      )}
      
      {/* Filtres par catégorie et tri */}
      <div className="w-full max-w-lg space-y-4">
        {/* Filtres par catégorie */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setSearchTerm("");
              }}
              className={`px-4 py-2 text-sm rounded-full ${
                selectedCategory === category
                  ? 'bg-[#9E6F6F] text-white'
                  : 'bg-[#e4d2d2] text-[#5D4E4E] hover:bg-[#c4afaf]'
              }`}
            >
              {category.replace('_', ' ')}
            </button>
          ))}
        </div>
        
        {/* Sélecteur de tri */}
        <div className="flex justify-center items-center gap-2">
          <label htmlFor="sort" className="text-[#5D4E4E] text-sm">
            Trier par prix:
          </label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-1 text-sm border border-[#9E6F6F] rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-[#9E6F6F]"
          >
            <option value="asc">Croissant</option>
            <option value="desc">Décroissant</option>
          </select>
        </div>
      </div>
    </div>
  );
}