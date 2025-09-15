import type { ReactNode } from "react";
import "./Modal.css"; 

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
}

export default function Modal({ open, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <header>
          <h2>{title}</h2>
        </header>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}
