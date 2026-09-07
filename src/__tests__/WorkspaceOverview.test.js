import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WorkspaceOverview from "../components/WorkspaceOverview";

test("calcule les indicateurs de l'espace de travail", () => {
  render(<WorkspaceOverview projects={[{ id: 1, name: "Projet A" }]} users={[{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]} todos={[{ id: 1, title: "Fini", projectId: 1, status: "done" }, { id: 2, title: "À faire", projectId: 1, status: "todo", assigneeId: 1 }]} user={{ id: 1 }} onNavigate={jest.fn()} onOpenTask={jest.fn()} />);
  expect(screen.getByText("50%")).toBeInTheDocument();
  expect(screen.getByText("2 tasks")).toBeInTheDocument();
  expect(screen.getByText("À faire")).toBeInTheDocument();
});

test("navigue vers les projets", async () => {
  const onNavigate = jest.fn();
  render(<WorkspaceOverview onNavigate={onNavigate} onOpenTask={jest.fn()} />);
  await userEvent.click(screen.getByRole("button", { name: /Ouvrir les projets/ }));
  expect(onNavigate).toHaveBeenCalledWith("projects");
});
