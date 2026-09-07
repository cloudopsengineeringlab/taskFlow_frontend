import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import Analytics from "../components/Analytics";
import { getAnalyticsApi } from "../api";

jest.mock("../api", () => ({ getAnalyticsApi: jest.fn() }));

describe("Analytics", () => {
  beforeEach(() => jest.clearAllMocks());

  test("affiche les indicateurs retournés par l'API", async () => {
    getAnalyticsApi.mockResolvedValue({ data: { summary: { total: 10, completed: 6, active: 4, overdue: 1, completionRate: 60 }, priority: { high: 3, medium: 5, low: 2 }, projects: [{ id: 1, name: "Projet A", total: 10, completed: 6, progress: 60 }] } });
    render(<Analytics />);
    await waitFor(() => expect(getAnalyticsApi).toHaveBeenCalledWith({ days: "30" }));
    expect(screen.getByText("Analyses")).toBeInTheDocument();
    expect(screen.getByText("60")).toBeInTheDocument();
    expect(screen.getByText("Projet A")).toBeInTheDocument();
    expect(screen.getByText("Haute")).toBeInTheDocument();
  });

  test("utilise les données locales si l'API est indisponible", async () => {
    getAnalyticsApi.mockRejectedValue(new Error("offline"));
    render(<Analytics todos={[{ completed: true }, { completed: false }]} />);
    expect(await screen.findByText(/API d’analyse indisponible/)).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
