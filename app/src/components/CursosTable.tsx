import type { Curso } from "../types/Curso";

interface CursosTableProps {
  cursos: Curso[];
  onDelete: (id: number) => void;
}

export default function CursosTable({ cursos, onDelete }: CursosTableProps) {
  if (cursos.length === 0) {
    return <p>No hay cursos disponibles.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Sigla</th>
          <th>Nombre</th>
          <th>Créditos</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {cursos.map((c) => (
          <tr key={c.id}>
            <td>{c.sigla}</td>
            <td>{c.nombre}</td>
            <td>{c.creditos}</td>
            <td className="acciones">
                <button className="btn-editar">Editar</button>
                <button className="btn-eliminar" onClick={() => onDelete(c.id)} >Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
