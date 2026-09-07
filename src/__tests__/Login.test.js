import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../components/Login";
import { useAuth } from "../auth";

jest.mock("../auth", () => ({ useAuth: jest.fn() }));

describe("Login", () => {
  test("soumet les identifiants", async () => {
    const login = jest.fn().mockResolvedValue({});
    useAuth.mockReturnValue({ login, loading: false });
    render(<Login />);
    await userEvent.clear(screen.getByLabelText("Adresse email"));
    await userEvent.type(screen.getByLabelText("Adresse email"), "user@test.local");
    await userEvent.clear(screen.getByLabelText("Mot de passe"));
    await userEvent.type(screen.getByLabelText("Mot de passe"), "secret");
    await userEvent.click(screen.getByRole("button", { name: "Se connecter" }));
    expect(login).toHaveBeenCalledWith("user@test.local", "secret");
  });

  test("affiche l'erreur de connexion", async () => {
    useAuth.mockReturnValue({ login: jest.fn().mockRejectedValue(new Error("Identifiants invalides")), loading: false });
    render(<Login />);
    await userEvent.click(screen.getByRole("button", { name: "Se connecter" }));
    expect(await screen.findByText("Identifiants invalides")).toBeInTheDocument();
  });
});
