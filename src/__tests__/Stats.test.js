import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Stats from "../components/Stats";

test("calcule les statistiques des tâches", () => {
  render(<Stats todos={[{ completed: true }, { completed: false }, { completed: true }]} />);
  expect(screen.getByText("3")).toBeInTheDocument();
  expect(screen.getAllByText("2")).toHaveLength(2);
  expect(screen.getByText("67%")).toBeInTheDocument();
});
