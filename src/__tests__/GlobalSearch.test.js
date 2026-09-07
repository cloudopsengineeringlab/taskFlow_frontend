import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GlobalSearch from "../components/GlobalSearch";

test("déclenche l'ouverture de la recherche", async () => {
  const onOpen = jest.fn();
  render(<GlobalSearch onOpen={onOpen} />);
  await userEvent.click(screen.getByRole("button", { name: /Rechercher/ }));
  expect(onOpen).toHaveBeenCalledTimes(1);
});
