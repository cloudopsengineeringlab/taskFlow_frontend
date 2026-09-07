import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ProjectStatsBar from "../components/ProjectStatsBar";

test("calcule les compteurs du projet", () => {
  render(<ProjectStatsBar todos={[{ status: "todo" }, { status: "in_progress" }, { status: "done" }, { completed: true }]} />);
  expect(screen.getByText("4 au total")).toBeInTheDocument();
  expect(screen.getByText("1 à faire")).toBeInTheDocument();
  expect(screen.getByText("1 en cours")).toBeInTheDocument();
  expect(screen.getByText("2 terminées")).toBeInTheDocument();
  expect(screen.getByText("50% complete")).toBeInTheDocument();
});
