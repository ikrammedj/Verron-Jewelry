// src/app/api/getProducts/route.js

import { db } from "../../../../firebaseConfig"; // Import de Firebase
import { collection, getDocs, query, limit } from "firebase/firestore";

// Export nommé pour la méthode GET
export const GET = async (req) => {
  try {
    const bijouxRef = collection(db, "products"); // Collection Firestore où tu stockes les bijoux
    const bijouxQuery = query(bijouxRef, limit(8)); // Ajout de la limite de 8
    const snapshot = await getDocs(bijouxQuery);
    const bijouxList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify(bijouxList), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erreur lors de la récupération des bijoux : " + error.message }),
      { status: 500 }
    );
  }
};
