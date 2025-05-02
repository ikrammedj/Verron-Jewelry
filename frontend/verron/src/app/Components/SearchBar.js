import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa";

export default function SearchBarWithFilter({ setBijoux, showSearchBar }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showSortOptions, setShowSortOptions] = useState(false);

  const categories = ["Tous", "Bagues", "Boucles d'oreilles"];

  const buildApiUrl = (category, search, sort) => {
    const apiCategory = category === "Boucles d'oreilles" 
      ? "boucles_oreilles" 
      : category.toLowerCase();

    let baseUrl;
    if (category === "Tous") {
      baseUrl = "http://127.0.0.1:5000/bijoux";
    } else {
      baseUrl = `http://127.0.0.1:5000/bijoux/categorie/${apiCategory}`;
    }

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

  useEffect(() => {
    fetchBijoux();
  }, [selectedCategory, sortOrder]);

  const handleSearch = () => {
    fetchBijoux();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSortOptionClick = (order) => {
    setSortOrder(order);
    setShowSortOptions(false);
  };

  return (
    <div className="flex flex-col items-center p-6 w-full bg-[#F7F1EB]">
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
      <div className="w-full max-w-lg space-y-4 mx-auto flex flex-col items-center">
        <div className="flex items-center justify-start gap-3 mb-4">
     
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

          <div className="relative">
            <button
              onClick={() => setShowSortOptions(!showSortOptions)}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-[#e4d2d2] text-[#5D4E4E] hover:bg-[#c4afaf] transition-colors"
            >
              <span>Tri par  </span>
              <FaChevronDown className={`transition-transform ${showSortOptions ? 'rotate-180' : ''}`} />
            </button>
            
            {showSortOptions && (
              <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={() => handleSortOptionClick("asc")}
                  className={`block w-full px-4 py-2 text-sm text-left ${
                    sortOrder === "asc" ? 'bg-[#9E6F6F] text-white' : 'text-[#5D4E4E] hover:bg-[#f0e6e6]'
                  }`}
                >
                  Prix Croissant
                </button>
                <button
                  onClick={() => handleSortOptionClick("desc")}
                  className={`block w-full px-4 py-2 text-sm text-left ${
                    sortOrder === "desc" ? 'bg-[#9E6F6F] text-white' : 'text-[#5D4E4E] hover:bg-[#f0e6e6]'
                  }`}
                >
                  Prix Décroissant
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
