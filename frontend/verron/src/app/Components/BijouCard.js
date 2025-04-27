export default function BijouCard({ bijou }) {
  return (
    <div className="card">
      <img src={bijou.image} alt={bijou.nom} className="card-img" />
      <h2>{bijou.nom}</h2>
      <p>{bijou.description}</p>
      <p><strong>{bijou.prix} DZD</strong></p>
    </div>
  )
}