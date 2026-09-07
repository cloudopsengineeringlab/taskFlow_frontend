import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ActivityLog from "../components/ActivityLog";

test("affiche les activités et les utilisateurs", () => {
  render(<ActivityLog activities={[{ id: 1, userId: 10, message: "a créé une tâche", createdAt: "2026-01-01T10:00:00Z" }]} users={[{ id: 10, name: "Alice" }]} />);
  expect(screen.getByText("Journal d’activité")).toBeInTheDocument();
  expect(screen.getByText(/Alice/)).toBeInTheDocument();
  expect(screen.getByText(/a créé une tâche/)).toBeInTheDocument();
});

test("affiche un état vide", () => {
  render(<ActivityLog />);
  expect(screen.getByText("Aucune activité pour le moment.")).toBeInTheDocument();
});
