import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectDialog from "../components/ProjectDialog";

describe("ProjectDialog", () => {
  test("crée un projet", async () => {
    const onSave = jest.fn();
    render(<ProjectDialog open project={null} onClose={jest.fn()} onSave={onSave} />);
    await userEvent.type(screen.getByLabelText("Nom"), " Nouveau projet ");
    await userEvent.type(screen.getByLabelText("Description"), " Description ");
    await userEvent.click(screen.getByRole("button", { name: "Créer le projet" }));
    expect(onSave).toHaveBeenCalledWith({ name: "Nouveau projet", description: "Description" });
  });

  test("charge les valeurs d'un projet existant", () => {
    render(<ProjectDialog open project={{ id: 5, name: "Projet", description: "Desc" }} onClose={jest.fn()} onSave={jest.fn()} />);
    expect(screen.getByLabelText("Nom")).toHaveValue("Projet");
    expect(screen.getByLabelText("Description")).toHaveValue("Desc");
    expect(screen.getByRole("button", { name: "Enregistrer les modifications" })).toBeInTheDocument();
  });
});
