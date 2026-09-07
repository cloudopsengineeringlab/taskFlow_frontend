import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoList from "../components/TodoList";

describe("TodoList Component", () => {
  test("affiche la liste des todos reçue par props", () => {
    render(<TodoList todos={[{ id: 1, title: "Faire les courses", completed: false }, { id: 2, title: "Apprendre Jest", completed: true }]} removeTodo={jest.fn()} editTodo={jest.fn()} />);
    expect(screen.getByText("Faire les courses")).toBeInTheDocument();
    expect(screen.getByText("Apprendre Jest")).toBeInTheDocument();
  });

  test("appelle removeTodo quand on clique sur supprimer", async () => {
    const mockRemove = jest.fn();
    render(<TodoList todos={[{ id: 1, title: "Supprime moi", completed: false }]} removeTodo={mockRemove} editTodo={jest.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Supprimer" }));
    expect(mockRemove).toHaveBeenCalledWith(1);
  });
});
