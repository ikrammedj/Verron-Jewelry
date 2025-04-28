import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";

export default function SearchBarWithFilter({ setBijoux, showSearchBar }) { // Retirez onClose des props
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const categories = ["Tous", "Bagues", "Boucles d'oreilles"];

  const fetchBijouxByCategory = async (category) => {
    try {
      const apiCategory = category === "Boucles d'oreilles" 
        ? "boucles_oreilles" 
        : category.toLowerCase();

      const url = category === "Tous"
        ? "http://127.0.0.1:5000/bijoux"
        : `http://127.0.0.1:5000/bijoux/categorie/${apiCategory}`;
      setBijoux(url);
    } catch (error) {
      console.error("Erreur lors de la récupération des bijoux par catégorie:", error);
    }
  };

  const fetchBijouxBySearch = async () => {
    try {
      const url = `http://127.0.0.1:5000/bijoux/rechercher?mot=${encodeURIComponent(searchTerm)}`;
      setBijoux(url);
    } catch (error) {
      console.error("Erreur lors de la recherche de bijoux:", error);
    }
  };

  useEffect(() => {
    if (searchTerm === "") { 
      fetchBijouxByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      fetchBijouxBySearch();
    } else {
      fetchBijouxByCategory(selectedCategory);
    }
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
      
      {/* Filtres par catégorie (toujours visibles) */}
      <div className="w-full max-w-lg">
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
      </div>
    </div>
  );
}