import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskDetailDialog from "../components/TaskDetailDialog";

test("affiche les détails et commentaires", () => {
  render(<TaskDetailDialog open task={{ id: 1, title: "Ma tâche", description: "Une description", status: "todo", priority: "high" }} users={[{ id: 2, name: "Alice", email: "a@test.local" }]} comments={[{ id: 1, userId: 2, text: "Mon commentaire", createdAt: "2026-01-01T10:00:00Z" }]} currentUser={{ id: 2 }} onAssign={jest.fn()} onComment={jest.fn()} onDelete={jest.fn()} onClose={jest.fn()} />);
  expect(screen.getByText("Ma tâche")).toBeInTheDocument();
  expect(screen.getByText("Une description")).toBeInTheDocument();
  expect(screen.getByText("Mon commentaire")).toBeInTheDocument();
});

test("envoie un commentaire", async () => {
  const onComment = jest.fn();
  render(<TaskDetailDialog open task={{ id: 1, title: "Ma tâche", status: "todo", priority: "medium" }} users={[]} comments={[]} onAssign={jest.fn()} onComment={onComment} onDelete={jest.fn()} onClose={jest.fn()} />);
  await userEvent.type(screen.getByPlaceholderText("Écrire un commentaire…"), "  Bonjour  ");
  await userEvent.click(screen.getByRole("button", { name: "Envoyer" }));
  expect(onComment).toHaveBeenCalledWith("Bonjour");
});

test("supprime la tâche et ferme la boîte de dialogue", async () => {
  const onDelete = jest.fn();
  const onClose = jest.fn();
  render(<TaskDetailDialog open task={{ id: 9, title: "À supprimer", status: "todo", priority: "low" }} users={[]} comments={[]} onAssign={jest.fn()} onComment={jest.fn()} onDelete={onDelete} onClose={onClose} />);
  await userEvent.click(screen.getByRole("button", { name: "Supprimer la tâche" }));
  expect(onDelete).toHaveBeenCalledWith(9);
  expect(onClose).toHaveBeenCalledTimes(1);
});
