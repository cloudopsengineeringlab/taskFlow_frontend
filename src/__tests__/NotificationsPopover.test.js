import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotificationsPopover from "../components/NotificationsPopover";
import { getNotificationsApi, getUnreadNotificationCountApi, markNotificationReadApi, markAllNotificationsReadApi } from "../api";

jest.mock("../api", () => ({ getNotificationsApi: jest.fn(), getUnreadNotificationCountApi: jest.fn(), markNotificationReadApi: jest.fn(), markAllNotificationsReadApi: jest.fn() }));

test("charge les notifications et les marque comme lues", async () => {
  getNotificationsApi.mockResolvedValue({ data: [{ id: 1, title: "Nouvelle tâche", message: "Bonjour", read: false, taskId: 9, task: { id: 9, title: "Tâche" } }] });
  getUnreadNotificationCountApi.mockResolvedValue({ data: { count: 1 } });
  markNotificationReadApi.mockResolvedValue({});
  const onOpenTask = jest.fn();
  render(<NotificationsPopover onOpenTask={onOpenTask} />);
  await userEvent.click(screen.getByRole("button", { name: "Notifications" }));
  expect(await screen.findByText("Nouvelle tâche")).toBeInTheDocument();
  await userEvent.click(screen.getByText("Nouvelle tâche"));
  await waitFor(() => expect(markNotificationReadApi).toHaveBeenCalledWith(1));
  expect(onOpenTask).toHaveBeenCalledWith({ id: 9, title: "Tâche" });
});

test("marque toutes les notifications comme lues", async () => {
  getNotificationsApi.mockResolvedValue({ data: [{ id: 1, title: "Alerte", message: "Test", read: false }] });
  getUnreadNotificationCountApi.mockResolvedValue({ data: { count: 1 } });
  markAllNotificationsReadApi.mockResolvedValue({});
  render(<NotificationsPopover />);
  await userEvent.click(screen.getByRole("button", { name: "Notifications" }));
  await screen.findByText("Alerte");
  await userEvent.click(screen.getByRole("button", { name: "Tout marquer comme lu" }));
  expect(markAllNotificationsReadApi).toHaveBeenCalled();
});
