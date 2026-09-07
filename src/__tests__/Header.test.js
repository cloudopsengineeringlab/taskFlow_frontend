import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "../components/Header";
import { useAuth } from "../auth";

jest.mock("../auth", () => ({ useAuth: jest.fn() }));
jest.mock("../components/NotificationsPopover", () => () => <button>Notifications mock</button>);
jest.mock("../components/GlobalSearch", () => ({ onOpen }) => <button onClick={onOpen}>Search mock</button>);

test("affiche l'utilisateur et permet la déconnexion", async () => {
  const logout = jest.fn();
  const toggleTheme = jest.fn();
  useAuth.mockReturnValue({ user: { name: "Alice", email: "alice@test.local" }, logout });
  render(<Header darkMode={false} toggleTheme={toggleTheme} onSearch={jest.fn()} onOpenTask={jest.fn()} />);
  expect(screen.getByText("TaskFlow")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Compte" }));
  expect(screen.getByText("Alice")).toBeInTheDocument();
  await userEvent.click(screen.getByText("Se déconnecter"));
  expect(logout).toHaveBeenCalled();
});
