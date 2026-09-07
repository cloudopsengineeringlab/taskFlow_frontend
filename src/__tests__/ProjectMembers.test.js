import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectMembers from "../components/ProjectMembers";

test("affiche les membres et permet de retirer un membre", async () => {
  const onRemove = jest.fn();
  render(<ProjectMembers project={{ memberIds: [1] }} users={[{ id: 1, name: "Alice", email: "alice@test.local", role: "member" }, { id: 2, name: "Bob", email: "bob@test.local", role: "manager" }]} onAdd={jest.fn()} onRemove={onRemove} />);
  expect(screen.getByText("Alice")).toBeInTheDocument();
  expect(screen.getByText("Bob")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Retirer Alice" }));
  expect(onRemove).toHaveBeenCalledWith(1);
});

test("permet d'ajouter un membre disponible", async () => {
  const onAdd = jest.fn();
  render(<ProjectMembers project={{ memberIds: [1] }} users={[{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]} onAdd={onAdd} onRemove={jest.fn()} />);
  const select = screen.getByRole("combobox");
  await userEvent.click(select);
  await userEvent.click(screen.getByRole("option", { name: "Bob" }));
  expect(onAdd).toHaveBeenCalledWith(2);
});
