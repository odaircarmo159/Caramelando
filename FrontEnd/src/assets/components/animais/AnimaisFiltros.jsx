export default function AnimaisFiltros({ filters, onChange }) {
  return (
    <section className="filters-panel">
      <input
        type="search"
        placeholder="Buscar por nome, especie ou cidade"
        value={filters.search}
        onChange={(event) => onChange("search", event.target.value)}
      />

      <select
        value={filters.especie}
        onChange={(event) => onChange("especie", event.target.value)}
      >
        <option value="">Todas as especies</option>
        <option value="Cachorro">Cachorros</option>
        <option value="Gato">Gatos</option>
      </select>

      <select
        value={filters.status}
        onChange={(event) => onChange("status", event.target.value)}
      >
        <option value="">Todos os status</option>
        <option value="DISPONIVEL">Disponivel</option>
        <option value="ADOTADO">Adotado</option>
        <option value="INDISPONIVEL">Indisponivel</option>
      </select>
    </section>
  )
}
