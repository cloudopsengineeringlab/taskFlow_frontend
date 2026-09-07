import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommandPalette from "../components/CommandPalette";
import { searchApi } from "../api";

jest.mock("../api", () => ({ searchApi: jest.fn() }));

test("affiche les commandes et déclenche une navigation", async () => {
  const onNavigate = jest.fn();
  render(<CommandPalette open onClose={jest.fn()} onNavigate={onNavigate} onNewTask={jest.fn()} onOpenTask={jest.fn()} onSelectProject={jest.fn()} />);
  await userEvent.click(screen.getByText("Ouvrir le tableau de bord"));
  expect(onNavigate).toHaveBeenCalledWith("dashboard");
});

test("effectue une recherche distante après deux caractères", async () => {
  searchApi.mockResolvedValue({ data: { tasks: [{ id: 1, title: "Docker", projectName: "Infra" }] } });
  const onOpenTask = jest.fn();
  render(<CommandPalette open onClose={jest.fn()} onNavigate={jest.fn()} onNewTask={jest.fn()} onOpenTask={onOpenTask} onSelectProject={jest.fn()} />);
  await userEvent.type(screen.getByPlaceholderText("Rechercher dans TaskFlow…"), "Docker");
  expect(await screen.findByText("Docker")).toBeInTheDocument();
  await waitFor(() => expect(searchApi).toHaveBeenCalledWith("Docker"), { timeout: 1000 });
  await userEvent.click(screen.getByText("Docker"));
  expect(onOpenTask).toHaveBeenCalledWith({ id: 1, title: "Docker", projectName: "Infra" });
});
