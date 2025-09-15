import { useEffect, useState } from "react";
import type { Curso } from "./types/Curso";
import CursosTable from "./components/CursosTable";
import Modal from "./components/Modal";

const API_URL = "http://localhost:3000"; 

export default function App() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [cursoSeleccionado, setCursoActual] = useState<Curso | null>(null);

  const fetchCursos = async () => {
    setLoading(true);
    const res = await fetch(API_URL);
    const data = await res.json();
    setCursos(data);
    setLoading(false);
  };

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const nuevo = {
      sigla: formData.get("sigla"),
      nombre: formData.get("nombre"),
      creditos: Number(formData.get("creditos")),
    };

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo),
    });
    setOpenCreate(false);
    fetchCursos();
    form.reset();
  }

  async function handleDelete() {
    if (!cursoSeleccionado) return;
    await fetch(`${API_URL}/${cursoSeleccionado.id}`, { method: "DELETE" });
    setOpenDelete(false);
    setCursoActual(null);
    fetchCursos();
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!cursoSeleccionado) return;
    const form = e.currentTarget;
    const formData = new FormData(form);
    const actualizado = {
      sigla: formData.get("sigla"),
      nombre: formData.get("nombre"),
      creditos: Number(formData.get("creditos")),
    };

    await fetch(`${API_URL}/${cursoSeleccionado.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(actualizado),
    });
    
    setOpenEdit(false);
    setCursoActual(null);
    fetchCursos();
    form.reset();
  }

  useEffect(() => {
    fetchCursos();
  }, []);

  if (loading) return <p>Cargando cursos...</p>;

  return (
    <div className="container">
      <div className="cursos-header">
        <h1>Lista de Cursos</h1>
        <button className="btn-crear" onClick={() => setOpenCreate(true)}>Crear Curso</button>
      </div>
      <CursosTable 
        cursos={cursos}
        onDelete={(id) => {
          const curso = cursos.find(c => c.id === id)!;
          setCursoActual(curso);
          setOpenDelete(true);
        }}
        onEdit={(id) => {
          const curso = cursos.find(c => c.id === id)!;
          setCursoActual(curso);
          setOpenEdit(true);
        }}
      />

      <Modal open={openDelete} title="Eliminar Curso">
        <p>¿Está seguro que desea eliminar el curso <strong>{cursoSeleccionado?.nombre}</strong>?</p>
        <div className="modal-buttons">
          <button className="modal-delete-btn" onClick={handleDelete}>Sí, eliminar</button>
          <button className="modal-cancel-btn" onClick={() => setOpenDelete(false)}>Cancelar</button>
        </div>
      </Modal>

      <Modal open={openCreate} title="Crear Curso">
        <form onSubmit={handleCreate}>
          <input name="sigla" placeholder="Sigla" required />
          <input name="nombre" placeholder="Nombre" required />
          <input name="creditos" type="number" min={0} placeholder="Créditos" required />
          <div className="modal-buttons">
            <button className="btn-crear" type="submit">Crear</button>
            <button className="modal-cancel-btn" onClick={() => setOpenCreate(false)}>Cancelar</button>
          </div>
        </form>
      </Modal>

      <Modal open={openEdit} title="Editar Curso">
        {cursoSeleccionado && (
          <form onSubmit={handleEdit}>
            <input name="sigla" defaultValue={cursoSeleccionado.sigla} required />
            <input name="nombre" defaultValue={cursoSeleccionado.nombre} required />
            <input name="creditos" type="number" min={0} defaultValue={cursoSeleccionado.creditos} required />
            <div className="modal-buttons">
              <button className="btn-crear" type="submit">Guardar</button>
              <button className="modal-cancel-btn" onClick={() => setOpenCreate(false)}>Cancelar</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
