import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Settings from "../components/Settings";
import { useAuth } from "../auth";
import { updatePasswordApi } from "../api";

jest.mock("../auth", () => ({ useAuth: jest.fn() }));
jest.mock("../api", () => ({ updatePasswordApi: jest.fn() }));

test("met à jour le profil", async () => {
  const updateProfile = jest.fn().mockResolvedValue({});
  useAuth.mockReturnValue({ user: { name: "Alice", email: "alice@test.local" }, updateProfile });
  render(<Settings darkMode={false} toggleTheme={jest.fn()} />);
  await userEvent.clear(screen.getByLabelText("Nom"));
  await userEvent.type(screen.getByLabelText("Nom"), "Bob");
  await userEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
  expect(updateProfile).toHaveBeenCalledWith({ name: "Bob", email: "alice@test.local" });
  expect(await screen.findByText("Profil mis à jour.")).toBeInTheDocument();
});

test("change le mot de passe", async () => {
  useAuth.mockReturnValue({ user: { name: "Alice", email: "alice@test.local" }, updateProfile: jest.fn() });
  updatePasswordApi.mockResolvedValue({});
  render(<Settings darkMode={false} toggleTheme={jest.fn()} />);
  await userEvent.type(screen.getByLabelText("Mot de passe actuel"), "old");
  await userEvent.type(screen.getByLabelText("Nouveau mot de passe"), "new");
  await userEvent.type(screen.getByLabelText("Confirmer le nouveau mot de passe"), "new");
  await userEvent.click(screen.getByRole("button", { name: "Changer le mot de passe" }));
  expect(updatePasswordApi).toHaveBeenCalledWith({ currentPassword: "old", newPassword: "new", newPassword_confirmation: "new" });
});
