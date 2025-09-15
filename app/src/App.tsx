import { useEffect, useState } from "react";
import type { Curso } from "./types/Curso";
import CursosTable from "./components/CursosTable";
import Modal from "./components/Modal";

const API_URL = "http://localhost:3000"; 

export default function App() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);


  const [openDelete, setOpenDelete] = useState(false);

  const [cursoActual, setCursoActual] = useState<Curso | null>(null);

  const fetchCursos = async () => {
    setLoading(true);
    const res = await fetch(API_URL);
    const data = await res.json();
    setCursos(data);
    setLoading(false);
  };

  async function handleDelete() {
    if (!cursoActual) return;
    await fetch(`http://localhost:3000/${cursoActual.id}`, { method: "DELETE" });
    setOpenDelete(false);
    setCursoActual(null);
    fetchCursos();
  }

  useEffect(() => {
    fetchCursos();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="container">
      <h1>Lista de Cursos</h1>
      <CursosTable 
        cursos={cursos}
          onDelete={(id) => {
          const curso = cursos.find(c => c.id === id)!;
          setCursoActual(curso);
          setOpenDelete(true);
        }}
      />

      <Modal open={openDelete} title="Eliminar Curso">
        <p>¿Esta seguro que desea eliminar el curso <strong>{cursoActual?.nombre}</strong>?</p>
        <div className="modal-buttons">
          <button className="modal-delete-btn" onClick={handleDelete}>Sí, eliminar</button>
          <button className="modal-cancel-btn" onClick={() => setOpenDelete(false)}>Cancelar</button>
        </div>
      </Modal>
    </div>
  );
}
