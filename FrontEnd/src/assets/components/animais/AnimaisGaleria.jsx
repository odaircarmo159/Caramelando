import AnimaisCard from "./AnimaisCard"

export default function AnimaisGaleria({ animals }) {
  if (!animals.length) {
    return (
      <div className="empty-state">
        <h3>Nenhum animal encontrado</h3>
        <p>Tente ajustar os filtros para encontrar outros perfis.</p>
      </div>
    )
  }

  return (
    <div className="grid-3">
      {animals.map((animal) => (
        <AnimaisCard key={animal.id} animal={animal} />
      ))}
    </div>
  )
}
