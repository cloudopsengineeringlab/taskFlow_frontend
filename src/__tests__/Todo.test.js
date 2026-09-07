import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoList from "../components/TodoList";

// On définit des mocks pour les fonctions passées en props
const mockRemove = jest.fn();
const mockToggle = jest.fn();

describe("TodoList Component", () => {

  test("affiche la liste des todos reçue par props", () => {
    const fakeTodos = [
      { id: 1, title: "Faire les courses", completed: false },
      { id: 2, title: "Apprendre Jest", completed: true }
    ];

    render(
      <TodoList 
        todos={fakeTodos} 
        removeTodo={mockRemove} 
        toggleTodo={mockToggle} 
      />
    );

    expect(screen.getByText("Faire les courses")).toBeInTheDocument();
    expect(screen.getByText("Apprendre Jest")).toBeInTheDocument();
  });

  test("appelle removeTodo quand on clique sur supprimer", async () => {
    const fakeTodos = [{ id: 1, title: "Supprime moi", completed: false }];
    
    render(
      <TodoList todos={fakeTodos} removeTodo={mockRemove} toggleTodo={mockToggle} />
    );

    const deleteButton = screen.getByRole("button");
    await userEvent.click(deleteButton);

    expect(mockRemove).toHaveBeenCalledWith(1);
  });
});