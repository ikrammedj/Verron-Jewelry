// src/app/api/getProducts/route.js

import { db } from "../../../../firebaseConfig"; // Import de Firebase
import { collection, getDocs, query, where, limit } from "firebase/firestore";

// Export nommé pour la méthode GET
export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category'); // Récupérer le paramètre de catégorie
    const page = parseInt(searchParams.get('page')) || 1; // Récupérer le numéro de la page (par défaut 1)
    const pageSize = parseInt(searchParams.get('limit')) || 10; // Récupérer la taille de la page (par défaut 10)
    const searchQuery = searchParams.get('searchQuery') || ''; // Récupérer le paramètre de recherche

    const bijouxRef = collection(db, "products"); // Collection Firestore où tu stockes les bijoux

    let q;
    if (category && category !== "Tous") {
      // Si une catégorie est spécifiée et différente de "Tous", filtrer les produits
      q = query(bijouxRef, where("category", "==", category));
    } else {
      // Sinon, récupérer tous les produits
      q = query(bijouxRef);
    }

    // Récupérer tous les documents correspondants à la requête
    const snapshot = await getDocs(q);

    // Filtrer les résultats en fonction de la recherche
    let filteredResults = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (searchQuery) {
      filteredResults = filteredResults.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Paginer les résultats
    const offset = (page - 1) * pageSize;
    const paginatedResults = filteredResults.slice(offset, offset + pageSize);

    // Renvoyer les résultats paginés et le nombre total de produits
    return new Response(JSON.stringify({
      products: paginatedResults,
      total: filteredResults.length, // Nombre total de produits après filtrage
    }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erreur lors de la récupération des bijoux : " + error.message }),
      { status: 500 }
    );
  }
};