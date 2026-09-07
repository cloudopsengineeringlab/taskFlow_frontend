import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuditLog from "../components/AuditLog";
import { getAuditLog } from "../api";

jest.mock("../api", () => ({ getAuditLog: jest.fn() }));

test("charge et affiche le journal d'audit", async () => {
  getAuditLog.mockResolvedValue({ data: [{ id: 1, message: "Alice a créé une tâche", action: "create", user: { name: "Alice" }, createdAt: "2026-01-01T10:00:00Z" }] });
  render(<AuditLog />);
  expect(await screen.findByText("Alice a créé une tâche")).toBeInTheDocument();
  expect(getAuditLog).toHaveBeenCalledWith({ action: "all", q: undefined, limit: 200 });
});

test("relance la recherche lorsque le filtre change", async () => {
  getAuditLog.mockResolvedValue({ data: [] });
  render(<AuditLog />);
  await screen.findByText("Aucune activité trouvée.");
  await userEvent.click(screen.getByRole("combobox"));
  await userEvent.click(screen.getByRole("option", { name: "Supprimer" }));
  await waitFor(() => expect(getAuditLog).toHaveBeenLastCalledWith({ action: "delete", q: undefined, limit: 200 }));
});
