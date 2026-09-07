import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import KanbanBoard from "../components/KanbanBoard";

describe("KanbanBoard", () => {
  const project = { id: 1 };
  const todos = [
    { id: 1, title: "Tâche à faire", projectId: 1, status: "todo", priority: "high" },
    { id: 2, title: "Tâche en cours", projectId: 1, status: "in_progress" },
    { id: 3, title: "Tâche terminée", projectId: 1, status: "done" },
    { id: 4, title: "Autre projet", projectId: 2, status: "todo" },
  ];

  test("répartit les tâches dans les colonnes", () => {
    render(<KanbanBoard project={project} todos={todos} users={[]} onMove={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText("À faire")).toBeInTheDocument();
    expect(screen.getByText("En cours")).toBeInTheDocument();
    expect(screen.getByText("Terminée")).toBeInTheDocument();
    expect(screen.getByText("À faire").closest("div")).toBeTruthy();
    expect(screen.getByText("En cours")).toBeInTheDocument();
    expect(screen.getByText("Terminée")).toBeInTheDocument();
    expect(screen.getByText("Autre projet")).not.toBeInTheDocument();
  });

  test("appelle les actions d'une carte", async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onOpen = jest.fn();
    render(<KanbanBoard project={project} todos={[todos[0]]} users={[]} onMove={jest.fn()} onEdit={onEdit} onDelete={onDelete} onOpen={onOpen} />);
    await userEvent.click(screen.getByRole("button", { name: "Modifier" }));
    await userEvent.click(screen.getByRole("button", { name: "Supprimer" }));
    await userEvent.click(screen.getByRole("button", { name: "Détails / commentaires" }));
    expect(onEdit).toHaveBeenCalledWith(todos[0]);
    expect(onDelete).toHaveBeenCalledWith(1);
    expect(onOpen).toHaveBeenCalledWith(todos[0]);
  });

  test("déplace une tâche avec les boutons de statut", async () => {
    const onMove = jest.fn();
    render(<KanbanBoard project={project} todos={[todos[0]]} users={[]} onMove={onMove} onEdit={jest.fn()} onDelete={jest.fn()} />);
    const buttons = screen.getAllByRole("button");
    const next = buttons.find(b => b.querySelector('[data-testid="ArrowForwardIcon"]'));
    await userEvent.click(next);
    expect(onMove).toHaveBeenCalledWith(todos[0], "in_progress");
  });
});
