import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Users from "../components/Users";
import { useAuth } from "../auth";
import { getUsersApi, createUserApi, deleteUserApi, updateUserApi } from "../api";

jest.mock("../auth", () => ({ useAuth: jest.fn() }));
jest.mock("../api", () => ({ getUsersApi: jest.fn(), createUserApi: jest.fn(), deleteUserApi: jest.fn(), updateUserApi: jest.fn(), normalizeList: x => x }));

beforeEach(() => { jest.clearAllMocks(); useAuth.mockReturnValue({ user: { id: 1, role: "admin" } }); });

test("charge les utilisateurs", async () => {
  getUsersApi.mockResolvedValue({ data: [{ id: 1, name: "Alice", email: "alice@test.local", role: "admin", status: "active" }] });
  render(<Users />);
  expect(await screen.findByText("Alice")).toBeInTheDocument();
  expect(screen.getByText("Administrateur: 1")).toBeInTheDocument();
});

test("crée un utilisateur depuis la boîte de dialogue", async () => {
  getUsersApi.mockResolvedValue({ data: [] });
  createUserApi.mockResolvedValue({ data: { id: 2, name: "Bob", email: "bob@test.local", role: "member", status: "active" } });
  render(<Users />);
  await screen.findByText("Membres de l'espace");
  await userEvent.click(screen.getByRole("button", { name: "Ajouter" }));
  await userEvent.type(screen.getByLabelText("Nom"), "Bob");
  await userEvent.type(screen.getByLabelText("Email"), "bob@test.local");
  await userEvent.type(screen.getByLabelText("Mot de passe"), "secret");
  await userEvent.click(screen.getByRole("button", { name: "Créer" }));
  await waitFor(() => expect(createUserApi).toHaveBeenCalledWith(expect.objectContaining({ name: "Bob", email: "bob@test.local", password: "secret", role: "member" })));
  expect(await screen.findByText("Bob")).toBeInTheDocument();
});

test("ne permet pas de supprimer l'utilisateur courant", async () => {
  getUsersApi.mockResolvedValue({ data: [{ id: 1, name: "Alice", email: "alice@test.local", role: "admin", status: "active" }] });
  render(<Users />);
  await screen.findByText("Alice");
  const buttons = screen.getAllByRole("button");
  expect(buttons.some(button => button.disabled)).toBe(true);
  expect(deleteUserApi).not.toHaveBeenCalled();
});
