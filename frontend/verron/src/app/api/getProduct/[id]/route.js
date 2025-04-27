import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../firebaseConfig";

export async function GET(req, { params }) {
     const { id } = await params;
    console.log("ID reçu dans l'API :", id); // Vérifiez la console du serveur
  
    if (!id) {
      return Response.json({ error: "ID manquant" }, { status: 400 });
    }
  
    try {
  
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) {
        return Response.json({ error: "Produit non trouvé" }, { status: 404 });
      }
  
      return Response.json({ id: docSnap.id, ...docSnap.data() });
    } catch (error) {
      console.error("Erreur lors de la récupération du produit :", error);
      return Response.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }

