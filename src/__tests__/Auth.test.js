import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../auth";
import { loginApi, logoutApi, meApi, updateProfileApi } from "../api";

jest.mock("../api", () => ({ loginApi: jest.fn(), logoutApi: jest.fn(), meApi: jest.fn(), updateProfileApi: jest.fn() }));

function Consumer() {
  const auth = useAuth();
  return <div><span>{auth.user?.name || "none"}</span><span>{String(auth.loading)}</span><button onClick={() => auth.login("a@test.local", "secret")}>login</button><button onClick={() => auth.logout()}>logout</button><button onClick={() => auth.updateProfile({ name: "Bob", email: "b@test.local" })}>profile</button></div>;
}

afterEach(() => { localStorage.clear(); jest.clearAllMocks(); });

test("se connecte et persiste la session", async () => {
  loginApi.mockResolvedValue({ data: { user: { id: 1, name: "Alice" }, access_token: "token" } });
  render(<AuthProvider><Consumer /></AuthProvider>);
  await waitFor(() => expect(screen.getByText("false")).toBeInTheDocument());
  await userEvent.click(screen.getByRole("button", { name: "login" }));
  expect(await screen.findByText("Alice")).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem("taskflow-session"))).toEqual({ user: { id: 1, name: "Alice" }, token: "token" });
});

test("récupère une session existante avec /me", async () => {
  localStorage.setItem("taskflow-session", JSON.stringify({ user: { id: 1, name: "Cached" }, token: "token" }));
  meApi.mockResolvedValue({ data: { user: { id: 1, name: "Remote" } } });
  render(<AuthProvider><Consumer /></AuthProvider>);
  expect(await screen.findByText("Remote")).toBeInTheDocument();
  expect(meApi).toHaveBeenCalled();
});

test("déconnecte et supprime la session", async () => {
  loginApi.mockResolvedValue({ data: { user: { id: 1, name: "Alice" }, access_token: "token" } });
  logoutApi.mockResolvedValue({});
  render(<AuthProvider><Consumer /></AuthProvider>);
  await waitFor(() => expect(screen.getByText("false")).toBeInTheDocument());
  await userEvent.click(screen.getByRole("button", { name: "login" }));
  await userEvent.click(screen.getByRole("button", { name: "logout" }));
  expect(screen.getByText("none")).toBeInTheDocument();
  expect(localStorage.getItem("taskflow-session")).toBeNull();
});
