import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoForm from "../components/TodoForm";

describe("TodoForm", () => {
  const projects = [{ id: "p1", name: "Projet A" }];
  const users = [{ id: "u1", name: "Alice" }];

  test("crée une tâche avec les valeurs saisies", async () => {
    const addTodo = jest.fn();
    render(<TodoForm addTodo={addTodo} projects={projects} users={users} />);
    await userEvent.clear(screen.getByLabelText("Titre"));
    await userEvent.type(screen.getByLabelText("Titre"), "  Ma tâche  ");
    await userEvent.type(screen.getByLabelText("Description"), "  Description  ");
    await userEvent.click(screen.getByRole("button", { name: "Créer la tâche" }));
    expect(addTodo).toHaveBeenCalledWith(expect.objectContaining({ title: "Ma tâche", description: "Description", projectId: "p1", status: "todo", priority: "medium", completed: false }));
  });

  test("ne soumet pas une tâche sans titre", async () => {
    const addTodo = jest.fn();
    render(<TodoForm addTodo={addTodo} />);
    await userEvent.click(screen.getByRole("button", { name: "Créer la tâche" }));
    expect(addTodo).not.toHaveBeenCalled();
  });

  test("préremplit le formulaire en mode édition", () => {
    render(<TodoForm addTodo={jest.fn()} projects={projects} users={users} initialTask={{ id: 2, title: "Ancienne", description: "Desc", status: "done", priority: "high", projectId: "p1", assigneeId: "u1" }} onCancel={jest.fn()} />);
    expect(screen.getByLabelText("Titre")).toHaveValue("Ancienne");
    expect(screen.getByLabelText("Description")).toHaveValue("Desc");
    expect(screen.getByRole("button", { name: "Enregistrer les modifications" })).toBeInTheDocument();
  });
});
