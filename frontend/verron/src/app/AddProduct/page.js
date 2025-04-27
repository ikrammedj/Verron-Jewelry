'use client';

// components/AddJewelForm.js
import { useState } from 'react';
import { db } from '../../../firebaseConfig';
import { collection, addDoc , Timestamp} from 'firebase/firestore';
import { uploadImage } from '../../utils/uploadImage';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]); 
  const [price, setPrice] = useState('');
  const [materials, setMaterials] = useState([]); 
  const [category, setCategory] = useState(''); 
  const [files, setFiles] = useState([]); 
  const categories = ['Bagues', 'Colliers', 'Bracelets', 'Boucles d\'oreilles', 'Pendentifs','Broches','autre'];

  // Gérer la sélection de plusieurs fichiers
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convertir FileList en tableau
    setFiles(selectedFiles);
  };

  // Ajouter un matériau avec son prix
  const addMaterial = () => {
    setMaterials([...materials, { material: '', price: '' }]); // Ajouter un nouvel objet matériau
  };

  // Mettre à jour un matériau spécifique
  const updateMaterial = (index, field, value) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index][field] = value;
    setMaterials(updatedMaterials);
  };

  // Supprimer un matériau
  const removeMaterial = (index) => {
    const updatedMaterials = materials.filter((_, i) => i !== index);
    setMaterials(updatedMaterials);
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Téléverser toutes les images sélectionnées
      const imageUrls = await Promise.all(
        files.map(async (file) => {
          const url = await uploadImage(file);
          return url;
        })
      );

      // Convertir les matériaux en un objet { matériau: prix }
      const materialsObject = materials.reduce((acc, curr) => {
        acc[curr.material] = parseFloat(curr.price);
        return acc;
      }, {});

      // Ajouter le produit à Firestore
      const docRef = await addDoc(collection(db, 'products'), {
        name,
        description,
        images: imageUrls, // Stocker plusieurs URLs d'images
        price: parseFloat(price),
        materials: materialsObject, // Stocker les matériaux sous forme d'objet
        category, 
        createdAt: Timestamp.now(),
      });

      console.log('Document written with ID: ', docRef.id);
      alert('Produit ajouté avec succès !');

      // Réinitialiser le formulaire
      setName('');
      setDescription('');
      setImages([]);
      setPrice('');
      setMaterials([]);
      setCategory('');
      setFiles([]);
    } catch (e) {
      console.error('Error adding document: ', e);
      alert('Une erreur est survenue lors de l\'ajout du produit.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg text-black shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center ">Ajouter un bijou</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Champ pour le nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom du bijou"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Champ pour la description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description du bijou"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Champ pour sélectionner plusieurs images */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Images</label>
          <input
            type="file"
            onChange={handleFileChange}
            multiple // Permettre la sélection de plusieurs fichiers
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            required
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700">Prix</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Prix du bijou"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Champ pour les matériaux */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Matériaux</label>
          {materials.map((material, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={material.material}
                onChange={(e) => updateMaterial(index, 'material', e.target.value)}
                placeholder="Matériau (ex: or, diamant)"
                className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <input
                type="number"
                value={material.price}
                onChange={(e) => updateMaterial(index, 'price', e.target.value)}
                placeholder="Prix du matériau"
                className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <button
                type="button"
                onClick={() => removeMaterial(index)}
                className="mt-1 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMaterial}
            className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
          >
            Ajouter un matériau
          </button>
        </div>

        {/* Menu déroulant pour la catégorie */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Catégorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="" disabled>Sélectionnez une catégorie</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat} className='text-black'>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Bouton de soumission */}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;