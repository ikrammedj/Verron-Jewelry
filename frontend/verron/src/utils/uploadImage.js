// utils/uploadImage.js
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
  
    const response = await fetch('https://api.imgbb.com/1/upload?key=78bb48963412a7e527db41dcdc3b6e98', {
      method: 'POST',
      body: formData
    });
  
    const data = await response.json();
    return data.data.url;
  };