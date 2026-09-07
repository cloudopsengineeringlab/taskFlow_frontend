import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectWorkspace from "../components/ProjectWorkspace";

jest.mock("../components/TaskFilters", () => () => <div>TaskFilters mock</div>);
jest.mock("../components/KanbanBoard", () => ({ todos }) => <div>Kanban mock ({todos.length})</div>);
jest.mock("../components/TodoList", () => ({ todos }) => <div>TodoList mock ({todos.length})</div>);
jest.mock("../components/ProjectStatsBar", () => () => <div>Stats mock</div>);
jest.mock("../components/ProjectMembers", () => () => <div>Members mock</div>);
jest.mock("../components/ActivityLog", () => () => <div>Activity mock</div>);

const base = { project: { id: 1, name: "Projet A", description: "Desc", memberIds: [] }, projects: [{ id: 1, name: "Projet A" }], todos: [{ id: 1, title: "T1", projectId: 1, status: "done" }, { id: 2, title: "T2", projectId: 1, status: "todo", dueDate: "2099-01-01" }], users: [], activities: [], onSelectProject: jest.fn(), onEditProject: jest.fn(), onDeleteProject: jest.fn(), onNewTask: jest.fn(), onMove: jest.fn(), onEditTask: jest.fn(), onDeleteTask: jest.fn(), onOpenTask: jest.fn(), onAddMember: jest.fn(), onRemoveMember: jest.fn() };

test("affiche le résumé du projet", () => {
  window.location.hash = "#/projects/1/overview";
  render(<ProjectWorkspace {...base} />);
  expect(screen.getByText("Projet A")).toBeInTheDocument();
  expect(screen.getByText("50%")).toBeInTheDocument();
  expect(screen.getByText("1")).toBeInTheDocument();
});

test("change de vue via les onglets", async () => {
  window.location.hash = "#/projects/1/board";
  render(<ProjectWorkspace {...base} />);
  await userEvent.click(screen.getByRole("tab", { name: /Tableau/ }));
  expect(screen.getByText(/Kanban mock/)).toBeInTheDocument();
});
