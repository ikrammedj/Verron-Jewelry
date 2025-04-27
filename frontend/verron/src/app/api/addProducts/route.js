import { db } from "../../../../firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const IMG_BB_API_KEY = "78bb48963412a7e527db41dcdc3b6e98"; // Remplace par ta clé API ImgBB

export async function POST(req) {
  try {
    const formData = await req.json();
    const { nom, prix, description, categorie, materiaux, images } = formData;

    if (!nom || !prix || !description || !categorie || !materiaux || materiaux.length === 0 || !images || images.length === 0) {
      return new Response(JSON.stringify({ error: "Tous les champs sont requis, y compris matériaux et au moins une image." }), { status: 400 });
    }

    // Vérifier si le produit existe déjà
    const productExists = await checkIfProductExists(nom);
    if (productExists) {
      return new Response(JSON.stringify({ error: "Ce produit existe déjà." }), { status: 400 });
    }

    // Fonction pour uploader une image sur ImgBB
    const uploadToImgBB = async (fileUrl) => {
      const formData = new FormData();
      formData.append("image", fileUrl);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMG_BB_API_KEY}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      return data.data.url;
    };

    // Upload des images et récupération des URLs
    const uploadedImageUrls = await Promise.all(images.map(uploadToImgBB));

    // Enregistrement du produit avec images et matériaux dans Firestore
    await addDoc(collection(db, "products"), {
      nom,
      prix: parseFloat(prix),
      description,
      categorie,
      materiaux,  // Stockage des matériaux
      images: uploadedImageUrls,  // Stockage des URLs ImgBB
    });

    return new Response(JSON.stringify({ message: "Produit ajouté avec succès !" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// Vérifie si un produit avec le même nom existe déjà
async function checkIfProductExists(nom) {
  const q = query(collection(db, "products"), where("nom", "==", nom));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty; // Retourne `true` si le produit existe, sinon `false`
}
