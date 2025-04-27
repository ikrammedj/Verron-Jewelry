// app/utils/api.js
const BASE_URL = "http://127.0.0.1:5000";
export async function getBijoux() {
  const res = await fetch(`${BASE_URL}/bijoux`);
  const xml = await res.text();
  console.log("Réponse brute XML :", xml);

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, "application/xml");

  return xmlDoc;
}
