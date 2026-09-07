import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Inbox from "../components/Inbox";
import { getNotificationsApi, markNotificationReadApi, markAllNotificationsReadApi } from "../api";

jest.mock("../api", () => ({ getNotificationsApi: jest.fn(), markNotificationReadApi: jest.fn(), markAllNotificationsReadApi: jest.fn() }));

test("affiche les notifications et ouvre la tâche", async () => {
  getNotificationsApi.mockResolvedValue({ data: [{ id: 1, title: "Tâche assignée", message: "Une tâche", read: false, taskId: 4, task: { id: 4, title: "Ma tâche" } }] });
  markNotificationReadApi.mockResolvedValue({});
  const onOpenTask = jest.fn();
  render(<Inbox onOpenTask={onOpenTask} />);
  expect(await screen.findByText("Tâche assignée")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Ouvrir" }));
  await waitFor(() => expect(markNotificationReadApi).toHaveBeenCalledWith(1));
  expect(onOpenTask).toHaveBeenCalledWith({ id: 4, title: "Ma tâche" });
});

test("désactive le bouton global lorsque tout est déjà lu", async () => {
  getNotificationsApi.mockResolvedValue({ data: [{ id: 1, title: "Lu", message: "Test", read: true }] });
  render(<Inbox onOpenTask={jest.fn()} />);
  await screen.findByText("Lu");
  expect(screen.getByRole("button", { name: "Mark all as read" })).toBeDisabled();
});
