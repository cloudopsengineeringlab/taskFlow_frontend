import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskFilters from "../components/TaskFilters";
import { createSavedViewApi, getSavedViewsApi } from "../api";

jest.mock("../api", () => ({ getSavedViewsApi: jest.fn(), createSavedViewApi: jest.fn(), deleteSavedViewApi: jest.fn() }));

describe("TaskFilters", () => {
  beforeEach(() => { jest.clearAllMocks(); getSavedViewsApi.mockResolvedValue({ data: [] }); });

  test("met à jour la recherche et réinitialise les filtres", async () => {
    const onChange = jest.fn();
    const value = { search: "", status: "all", priority: "all", project: "all", assignee: "all", due: "all" };
    render(<TaskFilters value={value} onChange={onChange} />);
    await userEvent.type(screen.getByPlaceholderText("Rechercher des tâches…"), "Docker");
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ search: "r" }));
    await userEvent.click(screen.getByRole("button", { name: "Réinitialiser" }));
    expect(onChange).toHaveBeenLastCalledWith(value);
  });

  test("enregistre une vue", async () => {
    createSavedViewApi.mockResolvedValue({ data: { id: 10, name: "Mes tâches", filters: { status: "todo" } } });
    const onChange = jest.fn();
    render(<TaskFilters value={{ search: "", status: "todo", priority: "all", project: "all", assignee: "all", due: "all" }} onChange={onChange} />);
    await userEvent.type(screen.getByPlaceholderText("Enregistrer la vue…"), "Mes tâches");
    await userEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
    await waitFor(() => expect(createSavedViewApi).toHaveBeenCalledWith(expect.objectContaining({ name: "Mes tâches", resource: "tâches" })));
    expect(screen.getByText("Mes tâches")).toBeInTheDocument();
  });
});
