import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../auth";

jest.mock("../auth", () => ({ useAuth: jest.fn() }));

test("affiche uniquement les pages autorisées", async () => {
  const setPage = jest.fn();
  useAuth.mockReturnValue({ can: permission => ["dashboard", "tâches", "projects"].includes(permission) });
  render(<Sidebar page="dashboard" setPage={setPage} />);
  expect(screen.getByText("Tableau de bord")).toBeInTheDocument();
  expect(screen.getByText("Tâches")).toBeInTheDocument();
  expect(screen.queryByText("Utilisateurs")).not.toBeInTheDocument();
  await userEvent.click(screen.getByText("Projets"));
  expect(setPage).toHaveBeenCalledWith("projects");
});
