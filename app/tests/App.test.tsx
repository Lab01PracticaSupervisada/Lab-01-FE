import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, beforeEach, vi } from "vitest";
import App from "../src/App.tsx";

const mockFetch = vi.fn() as vi.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

function mockFetchResponse(data: unknown, ok = true): Response {
  return {
    ok,
    json: async () => data,
  } as Response;
}

describe("App CRUD operations", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("Reads and displays courses", async () => {
    mockFetch.mockResolvedValueOnce(
      mockFetchResponse([
        { id: 1, sigla: "CS101", nombre: "Intro a la Programación", creditos: 4 },
        { id: 2, sigla: "CS102", nombre: "Estructuras de Datos", creditos: 3 },
      ])
    );

    render(<App />);

    expect(await screen.findByText("Intro a la Programación")).toBeInTheDocument();
    expect(screen.getByText("Estructuras de Datos")).toBeInTheDocument();
  });

  test("Creates a course", async () => {
    mockFetch.mockResolvedValueOnce(mockFetchResponse([]));

    render(<App />);
    await screen.findByText("Lista de Cursos");

    fireEvent.click(screen.getByRole("button", { name: /crear curso/i }));

    fireEvent.change(screen.getByPlaceholderText("Sigla"), { target: { value: "CS103" } });
    fireEvent.change(screen.getByPlaceholderText("Nombre"), { target: { value: "Bases de Datos" } });
    fireEvent.change(screen.getByPlaceholderText("Créditos"), { target: { value: "5" } });

    mockFetch.mockResolvedValueOnce(mockFetchResponse({}, true));
    mockFetch.mockResolvedValueOnce(
      mockFetchResponse([
        { id: 1, sigla: "CS103", nombre: "Bases de Datos", creditos: 5 },
      ])
    );

    fireEvent.submit(screen.getByRole("button", { name: /crear$/i }).closest("form")!);

    await waitFor(() => expect(screen.getByText("Bases de Datos")).toBeInTheDocument());
  });

  test("Updates a course", async () => {
    mockFetch.mockResolvedValueOnce(
      mockFetchResponse([
        { id: 1, sigla: "CS101", nombre: "Intro a la Programación", creditos: 4 },
      ])
    );

    render(<App />);
    await screen.findByText("Intro a la Programación");

    fireEvent.click(screen.getByRole("button", { name: /editar/i }));

    const nombreInput = screen.getByDisplayValue("Intro a la Programación");
    fireEvent.change(nombreInput, { target: { value: "Programación Avanzada" } });

    mockFetch.mockResolvedValueOnce(mockFetchResponse({}, true));
    mockFetch.mockResolvedValueOnce(
      mockFetchResponse([
        { id: 1, sigla: "CS101", nombre: "Programación Avanzada", creditos: 4 },
      ])
    );

    fireEvent.submit(screen.getByRole("button", { name: /guardar/i }).closest("form")!);

    await waitFor(() =>
      expect(screen.getByText("Programación Avanzada")).toBeInTheDocument()
    );
  });

  test("Deletes a course", async () => {
    mockFetch.mockResolvedValueOnce(
      mockFetchResponse([
        { id: 1, sigla: "CS101", nombre: "Intro a la Programación", creditos: 4 },
      ])
    );

    render(<App />);
    await screen.findByText("Intro a la Programación");

    fireEvent.click(screen.getByRole("button", { name: /eliminar/i }));

    mockFetch.mockResolvedValueOnce(mockFetchResponse({}, true));
    mockFetch.mockResolvedValueOnce(mockFetchResponse([]));

    fireEvent.click(screen.getByRole("button", { name: /sí, eliminar/i }));

    await waitFor(() =>
      expect(screen.queryByText("Intro a la Programación")).not.toBeInTheDocument()
    );
  });
});
