'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StickyNavbar from "../../Components/StickyNavbar";
import Footer2 from "@/app/Components/Footer2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "@/app/Components/Sidebar";
import wilayas from "../../../utils/wilayas.json";
import Livraison from "../../../utils/Livraison.json";
import communes from "../../../utils/communes.json";

export default function ProductPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [filteredCommunes, setFilteredCommunes] = useState([]);
  const [prixLivraison, SetPrixLivraison] = useState({
    prixLivraisonDomicile: 400,
    prixLivraisonBureau: 250
  });
  const [prix, setPrix] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [prixFinal, setPrixFinal] = useState(0);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nom: "",
    telephone: "",
    wilaya: { id: "", nom: "" },
    commune: "",
    note: "",
    typeLivraison: "domicile",
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "wilaya") {
      const selectedWilaya = wilayas.find((wilaya) => wilaya.id === value);
      setFormData({
        ...formData,
        wilaya: { id: selectedWilaya.id, nom: selectedWilaya.nom },
      });

      const communesForWilaya = communes.filter((commune) => commune.codeWilaya === value);
      setFilteredCommunes(communesForWilaya); // Mettre à jour les communes filtrées

      // Récupérer les prix de livraison pour la wilaya sélectionnée
      const livraison = Livraison.find((liv) => liv.id === value);
      SetPrixLivraison(livraison || { prixLivraisonDomicile: 0, prixLivraisonBureau: 0 });
    } else if (name === "typeLivraison") {
      setFormData({
        ...formData,
        typeLivraison: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
};

  
  const updatePrixFinal = (productPrice, qty, livraison, typeDelivery) => {
    const livraisonPrice = typeDelivery === "domicile" 
      ? livraison.prixLivraisonDomicile 
      : livraison.prixLivraisonBureau;
    
    setPrixFinal(productPrice * qty + (livraisonPrice || 0));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate nom
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est obligatoire";
    }
    
    // Validate telephone
    const phoneRegex = /^0[567][0-9]{8}$/;
    if (!phoneRegex.test(formData.telephone)) {
      newErrors.telephone = "Veuillez entrer un numéro de téléphone algérien valide";
    }
    
    // Validate wilaya
    if (!formData.wilaya.id) {
      newErrors.wilaya = "Veuillez sélectionner une wilaya";
    }
    
    // Validate commune
    if (!formData.commune) {
      newErrors.commune = "Veuillez sélectionner une commune";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // 1. Construire le XML selon le format attendu par l'API
      const xmlData = `
        <order>
          <nom_prenom>${formData.nom}</nom_prenom>
          <telephone>${formData.telephone}</telephone>
          <wilaya>${formData.wilaya.nom}</wilaya>
          <commune>${formData.commune}</commune>
          <quantite>${quantity}</quantite>
          <type>${formData.typeLivraison}</type>
          <bijoux>
            <bijou>
              <nom>Produit ${id}</nom>
              <prix>${prix}</prix>
            </bijou>
          </bijoux>
          ${formData.note ? `<note>${formData.note}</note>` : ''}
        </order>
      `;
  
      // 2. Envoyer la requête avec le bon Content-Type
      const response = await fetch('http://127.0.0.1:5000/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml', // Important!
        },
        body: xmlData,
      });
      console.log(response);
      // 3. Parser la réponse XML
      const responseText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(responseText, "text/xml");
  
      if (response.ok) {
        const message = xmlDoc.getElementsByTagName('message')[0]?.textContent || 'Commande soumise avec succès!';
        toast.success(message);
        setShowForm(false);
        // Reset form
        setFormData({
          nom: "",
          telephone: "",
          wilaya: { id: "", nom: "" },
          commune: "",
          note: "",
          typeLivraison: "domicile",
        });
      } else {
        const errorMessage = xmlDoc.getElementsByTagName('message')[0]?.textContent || "Erreur lors de la soumission";
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Erreur lors de la soumission:", err);
      toast.error("Erreur de connexion au serveur");
    }
  };

  useEffect(() => {
    const fetchAndTransform = async () => {
      if (!id) {
        setError("ID de produit manquant");
        setLoading(false);
        return;
      }

      try {
        // 1. Charger le XML
        const xmlResponse = await fetch(`http://127.0.0.1:5000/bijoux/nom/${id}`);
        if (!xmlResponse.ok) {
          throw new Error(`Erreur HTTP XML: ${xmlResponse.status}`);
        }
        const xmlText = await xmlResponse.text();
        const xmlDoc = new DOMParser().parseFromString(xmlText, "text/xml");

        // Vérifier les erreurs XML
        const parserErrors = xmlDoc.getElementsByTagName("parsererror");
        if (parserErrors.length > 0) {
          throw new Error("Erreur de parsing XML: " + parserErrors[0].textContent);
        }

        // 2. Charger le XSLT
        const xslResponse = await fetch('/bijou.xslt');
        if (!xslResponse.ok) {
          throw new Error(`Erreur HTTP XSLT: ${xslResponse.status}`);
        }
        const xslText = await xslResponse.text();
        const xslDoc = new DOMParser().parseFromString(xslText, "text/xml");

        // Vérifier les erreurs XSLT
        const xsltErrors = xslDoc.getElementsByTagName("parsererror");
        if (xsltErrors.length > 0) {
          throw new Error("Erreur de parsing XSLT: " + xsltErrors[0].textContent);
        }
        if (typeof XSLTProcessor === 'undefined') {
          throw new Error("XSLTProcessor n'est pas disponible dans ce navigateur");
        }

        const processor = new XSLTProcessor();
        processor.importStylesheet(xslDoc);

        // Créer un document temporaire pour la transformation
        const resultDoc = processor.transformToDocument(xmlDoc);
        const serializer = new XMLSerializer();
        const resultHtml = serializer.serializeToString(resultDoc);

        if (!resultHtml || resultHtml.trim() === "") {
          throw new Error("La transformation a retourné un résultat vide");
        }
        let finalHtml = resultHtml;

        finalHtml = finalHtml.replace(
          /src="([^"]*\/images\/[^"]*)"/g,
          (match, path) => {
            const imageName = path.split('/').pop();
            return `src="/images/${imageName}"`;
          }
        );

        setHtmlContent(finalHtml);
        
        // Extract product price from XML
        const priceElement = xmlDoc.getElementsByTagName("prix")[0];
        if (priceElement) {
          const productPrice = parseInt(priceElement.textContent, 10);
          setPrix(productPrice);
          updatePrixFinal(productPrice, quantity, prixLivraison, formData.typeLivraison);
        }
      } catch (err) {
        console.error("Erreur de transformation:", err);
        setError(`Échec de la transformation: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAndTransform();
  }, [id]);

  useEffect(() => {
    if (!htmlContent) return;
  
    const button = document.getElementById("buyButton");
    const handleClick = () => setShowForm(true);
  
    button?.addEventListener("click", handleClick);
  
    return () => {
      button?.removeEventListener("click", handleClick);
    };
  }, [htmlContent, showForm]);

  const closeForm = () => {
    setShowForm(false);
  };


  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10) || 1;
    setQuantity(newQuantity);
    updatePrixFinal(prix, newQuantity, prixLivraison, formData.typeLivraison);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-2xl font-bold">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-bold text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F1EB] ">
      <StickyNavbar />
      <ToastContainer />
      <Sidebar />
      <div className="flex flex-col bg-[#F7F1EB] py-8">
        <div
          className="mx-auto w-11/12 max-w-5xl bg-[#F7F1EB] p-8 rounded shadow text-gray-700"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
      {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 h-full overflow-y-auto">
              <div className="bg-white p-6 rounded-lg sm:w-10/12 md:w-10/12 w-5/6 h-auto max-h-[90vh] flex flex-col relative overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-black">Informations de livraison</h2>
                <form onSubmit={handleFormSubmit} className="flex-grow overflow-y-auto">
                  {/* Nom */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Nom et Prénom</label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-black"
                      required
                    />
                    {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                  </div>

                  {/* Téléphone */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-black"
                      required
                      pattern="^0[567][0-9]{8}$"
                      title="Veuillez entrer un numéro de téléphone algérien valide."
                    />
                    {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
                  </div>

                  {/* Wilaya */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Wilaya</label>
                    <select
                      name="wilaya"
                      value={formData.wilaya.id}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-black"
                      required
                    >
                      <option value="" disabled>Sélectionnez une wilaya</option>
                      {wilayas.map((wilaya) => (
                        <option key={wilaya.id} value={wilaya.id}>
                          {wilaya.id} - {wilaya.nom}
                        </option>
                      ))}
                    </select>
                    {errors.wilaya && <p className="text-red-500 text-sm mt-1">{errors.wilaya}</p>}
                  </div>

                  {/* Commune */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Commune</label>
                    <select
                      name="commune"
                      value={formData.commune}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-black"
                      required
                      disabled={!formData.wilaya.id}
                    >
                      <option value="" disabled>
                        Sélectionnez une commune
                      </option>
                      {filteredCommunes.map((commune, index) => (
                        <option key={index} value={commune.nom}>
                          {commune.nom}
                        </option>
                      ))}
                    </select>
                    {errors.commune && <p className="text-red-500 text-sm mt-1">{errors.commune}</p>}
                  </div>

                  {/* Quantité */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Quantité</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="mt-1 block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-black"
                    />
                  </div>

                  {/* Type de livraison */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Type de livraison</label>
                    <div className="flex flex-col sm:flex-row gap-4 mt-1">
                      <label className="flex items-center text-black">
                        <input
                          type="radio"
                          name="typeLivraison"
                          value="domicile"
                          checked={formData.typeLivraison === "domicile"}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Livraison à domicile {prixLivraison && `(${prixLivraison.prixLivraisonDomicile || 0} DA)`}
                      </label>

                      <label className="flex items-center text-black">
                        <input
                          type="radio"
                          name="typeLivraison"
                          value="bureau"
                          checked={formData.typeLivraison === "bureau"}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Bureau de livraison {prixLivraison && `(${prixLivraison.prixLivraisonBureau || 0} DA)`}
                      </label>
                    </div>
                  </div>

                  {/* Note */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Note (optionnel)</label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-black"
                      rows={3}
                    />
                  </div>

                  {/* Conteneur des boutons et du récapitulatif */}
                  <div className="flex flex-col sm:flex-row justify-between items-end mt-4">
                    {/* Récapitulatif des prix */}
                    <div className="p-3 rounded-md text-sm w-full sm:w-40 mb-4 sm:mb-0">
                      <div className="flex justify-between text-gray-700 text-xs">
                        <span>Produit:</span>
                        <span>{prix} DA</span>
                      </div>
                      <div className="flex justify-between text-gray-700 text-xs">
                        <span>Quantité:</span>
                        <span>{quantity}</span>
                      </div>
                      <div className="flex justify-between text-gray-700 text-xs">
                        <span>Livraison:</span>
                        <span>
                          {formData.typeLivraison === "domicile"
                            ? prixLivraison.prixLivraisonDomicile
                            : prixLivraison.prixLivraisonBureau} DA
                        </span>
                      </div>
                      <hr className="my-1 border-gray-400" />
                      <div className="flex justify-between text-sm font-bold text-gray-900">
                        <span>Total:</span>
                        <span>{prixFinal} DA</span>
                      </div>
                    </div>

                    {/* Boutons */}
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={closeForm}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-300"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300"
                      >
                        Confirmer
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
      <Footer2 />
    </div>
  );
}