import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../components/Dashboard";
import { getDashboardApi } from "../api";

jest.mock("../api", () => ({ getDashboardApi: jest.fn() }));

describe("Dashboard", () => {
  beforeEach(() => jest.clearAllMocks());

  test("affiche les données locales par défaut", async () => {
    getDashboardApi.mockResolvedValue({ data: {} });
    render(<Dashboard todos={[{ status: "done" }, { status: "todo" }]} projects={[{ id: 1 }]} users={[{ id: 1 }]} />);
    await waitFor(() => expect(getDashboardApi).toHaveBeenCalledWith({ days: 30 }));
    expect(screen.getByText("Tableau de bord")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1 personnes")).toBeInTheDocument();
  });

  test("affiche le mode hors ligne si l'API échoue", async () => {
    getDashboardApi.mockRejectedValue(new Error("offline"));
    render(<Dashboard />);
    expect(await screen.findByText("Mode hors ligne")).toBeInTheDocument();
  });
});
